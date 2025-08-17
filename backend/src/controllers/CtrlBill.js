import PDFDocument from "pdfkit";
import fs from "fs";
import nodemailer from "nodemailer";
import Cliente from "../models/Customers.js";
import Distribuidor from "../models/Distributors.js";
import { config } from "../config.js";

//  Función para crear el PDF en memoria y devolverlo en la respuesta
const generarFacturaPDF = (res, datos) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=factura.pdf");
  doc.pipe(res);

  // ENCABEZADO 
  doc.fontSize(20).text("FACTURA", { align: "center" });
  doc.moveDown();

  // DATOS CLIENTE/DISTRIBUIDOR 
  doc.fontSize(12).text("DATOS DEL CLIENTE:", { underline: true });
  doc.text(`Nombre: ${datos.nombre}`);
  doc.text(`Email: ${datos.email}`);
  doc.text(`Teléfono: ${datos.telefono}`);
  doc.text(`Dirección: ${datos.direccion}`);
  doc.moveDown();

  //  DATOS DE LA EMPRESA 
  doc.fontSize(12).text("DATOS DE LA EMPRESA:", { underline: true });
  doc.text("Banco: Banco Borcelle");
  doc.text("Nombre: Alba Castro");
  doc.text("Número de cuenta: ES123456789");
  doc.moveDown();

  //  TABLA PRODUCTOS 
  doc.fontSize(12).text("INFORMACIÓN DE PAGO:", { underline: true });
  doc.moveDown();

  const tableTop = doc.y;
  const itemX = 50;
  const cantidadX = 300;
  const precioX = 400;
  const totalX = 480;

  doc.font("Helvetica-Bold");
  doc.text("Detalle", itemX, tableTop);
  doc.text("Cantidad", cantidadX, tableTop);
  doc.text("Precio", precioX, tableTop);
  doc.text("Total", totalX, tableTop);
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  // Render items
  let totalFactura = 0;
  datos.items.forEach((item, i) => {
    const y = tableTop + 25 + i * 20;
    const subtotal = item.cantidad * item.precio;
    totalFactura += subtotal;

    doc.font("Helvetica");
    doc.text(item.detalle, itemX, y);
    doc.text(item.cantidad.toString(), cantidadX, y);
    doc.text(`${item.precio} €`, precioX, y);
    doc.text(`${subtotal} €`, totalX, y);
  });

  doc.moveDown(2);
  const ivaMonto = (totalFactura * datos.iva) / 100;
  const totalConIVA = totalFactura + ivaMonto;

  doc.font("Helvetica-Bold");
  doc.text(`Subtotal: ${totalFactura} €`, { align: "right" });
  doc.text(`IVA (${datos.iva}%): ${ivaMonto.toFixed(2)} €`, { align: "right" });
  doc.text(`TOTAL: ${totalConIVA.toFixed(2)} €`, { align: "right" });

  doc.moveDown(3);
  doc.fontSize(10).text("Gracias por su compra.", { align: "center" });

  doc.end();
};

//  Descargar factura
export const descargarFactura = async (req, res) => {
  try {
    const { userId, tipo } = req.query; // tipo = "cliente" o "distribuidor"

    let datos;
    if (tipo === "cliente") {
      datos = await Cliente.findById(userId);
    } else {
      datos = await Distribuidor.findById(userId);
    }

    // Ejemplo de items desde carrito (mock)
    const factura = {
      ...datos._doc,
      items: [
        { detalle: "Diseño de Logotipo", cantidad: 1, precio: 200 },
        { detalle: "Presentación", cantidad: 1, precio: 100 },
      ],
      iva: 21,
    };

    generarFacturaPDF(res, factura);
  } catch (error) {
    res.status(500).json({ msg: "Error al generar factura", error });
  }
};

//  Enviar factura por correo
export const enviarFacturaEmail = async (req, res) => {
  try {
    const { userId, tipo } = req.body;

    let datos;
    if (tipo === "cliente") {
      datos = await Cliente.findById(userId);
    } else {
      datos = await Distribuidor.findById(userId);
    }

    // Generar PDF temporal
    const filePath = "factura.pdf";
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text("FACTURA", { align: "center" });
    doc.text(`Factura de ${datos.nombre}`);
    doc.end();

    // Configuración de Nodemailer
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.email_user,
        pass: config.email.email_pass 
      },
    });

    await transporter.sendMail({
      from: '"BlueFruitNutrition" <tucorreo@gmail.com>',
      to: datos.email,
      subject: "Tu factura de compra",
      text: "Adjuntamos tu factura en PDF",
      attachments: [{ filename: "factura.pdf", path: filePath }],
    });

    res.json({ msg: "Factura enviada al correo" });
  } catch (error) {
    res.status(500).json({ msg: "Error al enviar factura", error });
  }
};

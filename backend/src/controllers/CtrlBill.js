import PDFDocument from "pdfkit";
import fs from "fs";
import nodemailer from "nodemailer";
import Cliente from "../models/Customers.js";
import Distribuidor from "../models/Distributors.js";
import { config } from "../config.js";

// Función para crear PDF con el diseño profesional de BlueFruit
const generarFacturaPDF = (res, datosUsuario, datosCompra = null) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=factura_bluefruit.pdf");
  doc.pipe(res);

  //  COLORES DEL DISEÑO
  const azulOscuro = '#0C133F';    // Color azul oscuro de BlueFruit
  const azulClaro = '#4A90E2';     // Color azul claro
  const grisClaro = '#F8F9FA';     // Color gris claro para fondos
  const verde = '#28A745';         // Color verde para detalles

  // HEADER AZUL CON LOGO Y TÍTULO
  doc.rect(0, 0, doc.page.width, 120).fill(azulOscuro);

  // LOGO CON MANEJO DE ERRORES
  doc.image('assets/Logo_Blue.png', 60, 25, { width: 90, height: 100 });

  // Título FACTURA en el header
  doc.fontSize(28)
     .fill('white')
     .text('FACTURA', 350, 40, { width: 200, align: 'right' });
     

  // Número de factura en recuadro
  const numeroOrden = datosCompra?.orden?.numeroOrden || `N°: ${Date.now().toString().slice(-6)}`;
  doc.rect(380, 70, 150, 30)
     .stroke('white')
     .strokeColor('white')
     .lineWidth(2);
  
  doc.fontSize(12)
     .fill('white')
     .text(numeroOrden, 385, 82, { width: 140, align: 'center' });

  // ESETEAR POSICIÓN DESPUÉS DEL HEADER
  doc.y = 150;

  //  SECCIÓN DE DATOS EN DOS COLUMNAS
  const leftColumnX = 60;
  const rightColumnX = 320;
  const sectionY = doc.y;

  // DATOS DEL CLIENTE (Columna izquierda)
  doc.fontSize(14)
     .fill(azulOscuro)
     .font('Helvetica-Bold')
     .text('DATOS DEL CLIENTE', leftColumnX, sectionY);

  doc.fontSize(10)
     .fill('black')
     .font('Helvetica')
     .text(`${datosUsuario.name || datosUsuario.companyName || 'Administrador'}`, leftColumnX, sectionY + 25)
     .text(`${datosUsuario.email || 'admin@bluefruit.com'}`, leftColumnX, sectionY + 40)
     .text(`${datosUsuario.phone || 'N/A'}`, leftColumnX, sectionY + 55);

  // Dirección de envío si existe
  if (datosCompra?.datosEnvio) {
    doc.text(`${datosCompra.datosEnvio.direccionCompleta}`, leftColumnX, sectionY + 70, { width: 200 });
  } else {
    doc.text(`${datosUsuario.address || 'N/A'}`, leftColumnX, sectionY + 70, { width: 200 });
  }

  // DATOS DE LA EMPRESA (Columna derecha)
  doc.fontSize(14)
     .fill(azulOscuro)
     .font('Helvetica-Bold')
     .text('DATOS DE LA EMPRESA', rightColumnX, sectionY);

  doc.fontSize(10)
     .fill('black')
     .font('Helvetica')
     .text('BlueFruit Nutrition', rightColumnX, sectionY + 25)
     .text('contacto@bluefruit.com', rightColumnX, sectionY + 40)
     .text('+503 1234-5678', rightColumnX, sectionY + 55)
     .text('San Salvador, El Salvador', rightColumnX, sectionY + 70);

  //  INFORMACIÓN DE LA ORDEN EN LA MISMA LÍNEA - PERFECTO ALINEAMIENTO
  const ordenY = sectionY + 110;
  
  // Preparar los textos
  const numeroOrdenFinal = datosCompra?.numeroOrden || datosCompra?.orden?.numeroOrden || `ORD-${Date.now().toString().slice(-6)}`;
  const fechaOrden = datosCompra?.fecha || datosCompra?.orden?.fecha || new Date().toLocaleDateString();
  
  // CONFIGURAR FONT Y COLOR UNA SOLA VEZ
  doc.fontSize(12)
     .fillColor(azulOscuro)
     .font('Helvetica-Bold');
     
  
  //  COLOCAR AMBOS TEXTOS EN LA MISMA LÍNEA Y CON COORDENADAS EXACTAS
  doc.text(`Orden: ${numeroOrdenFinal}`, leftColumnX, ordenY);           // Posición izquierda
  doc.text(`Fecha: ${fechaOrden}`, leftColumnX + 250, ordenY);           // Posición derecha - MISMA Y

  //  TABLA DE PRODUCTOS CON ESTILO
  const tableStartY = ordenY + 30;  // Espacio fijo después de orden/fecha
  const tableTop = tableStartY;
  const tableHeight = 25;
  
  // Header de la tabla con fondo azul
  doc.rect(leftColumnX, tableTop, 470, tableHeight)
     .fill(azulOscuro);

  // Columnas de la tabla
  const colDetalle = leftColumnX + 10;
  const colCantidad = leftColumnX + 280;
  const colPrecio = leftColumnX + 350;
  const colTotal = leftColumnX + 420;

  // Títulos de columnas en blanco
  doc.fontSize(11)
     .fill('white')
     .font('Helvetica-Bold')
     .text('Detalle', colDetalle, tableTop + 8)
     .text('Cantidad', colCantidad, tableTop + 8)
     .text('Precio', colPrecio, tableTop + 8)
     .text('Total', colTotal, tableTop + 8);

  // ✅ PRODUCTOS REALES
  let productos = [];
  let totalFactura = 0;

  if (datosCompra?.productos && datosCompra.productos.length > 0) {
    productos = datosCompra.productos;
    totalFactura = datosCompra.total || productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  } else {
    // Fallback a productos mock
    productos = [
      { nombre: "Proteína Whey - Vainilla", cantidad: 2, precio: 45.99 },
      { nombre: "Creatina Monohidrato", cantidad: 1, precio: 25.50 },
    ];
    totalFactura = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  }

  // Filas de productos
  let currentY = tableTop + tableHeight;
  productos.forEach((producto, i) => {
    const rowHeight = 25;
    const isEven = i % 2 === 0;
    
    // Fondo alternado para filas
    if (isEven) {
      doc.rect(leftColumnX, currentY, 470, rowHeight)
         .fill(grisClaro);
    }

    const subtotal = producto.precio * producto.cantidad;

    doc.fontSize(10)
       .fill('black')
       .font('Helvetica')
       .text(producto.nombre, colDetalle, currentY + 8, { width: 250 })
       .text(producto.cantidad.toString(), colCantidad, currentY + 8)
       .text(`$${producto.precio.toFixed(2)}`, colPrecio, currentY + 8)
       .text(`$${subtotal.toFixed(2)}`, colTotal, currentY + 8);

    currentY += rowHeight;
  });

  // Línea separadora
  doc.moveTo(leftColumnX, currentY)
     .lineTo(leftColumnX + 470, currentY)
     .stroke(azulOscuro);

  // ✅SECCIÓN DE TOTALES SIN IVA - SIMPLIFICADA
  currentY += 20;

  // Cálculos en columna derecha (solo subtotal = total, sin IVA)
  const totalsX = leftColumnX + 300;
  
  doc.fontSize(11)
     .fill('black')
     .font('Helvetica')
     .text(`Subtotal:`, totalsX, currentY)
     .text(`${totalFactura.toFixed(2)}`, totalsX + 100, currentY, { align: 'right', width: 70 });

  // Total final destacado (sin IVA, igual al subtotal)
  currentY += 25;
  doc.rect(totalsX - 10, currentY - 5, 180, 30)
     .fill(azulOscuro);

  doc.fontSize(14)
     .fill('white')
     .font('Helvetica-Bold')
     .text('TOTAL', totalsX, currentY + 5)
     .text(`${totalFactura.toFixed(2)}`, totalsX + 100, currentY + 5, { align: 'right', width: 70 });

  // INFORMACIÓN DE PAGO EN RECUADRO
  currentY += 60;
  doc.rect(leftColumnX, currentY, 200, 80)
     .stroke(azulOscuro)
     .strokeColor(azulOscuro)
     .lineWidth(2);

  doc.fontSize(12)
     .fill(azulOscuro)
     .font('Helvetica-Bold')
     .text('INFORMACIÓN DE PAGO', leftColumnX + 10, currentY + 10);

  doc.fontSize(10)
     .fill('black')
     .font('Helvetica')
     .text('Transferencia bancaria', leftColumnX + 10, currentY + 30)
     .text('Banco: Banco Agrícola', leftColumnX + 10, currentY + 45)
     .text('A nombre de: BlueFruit Nutrition', leftColumnX + 10, currentY + 60);

  // FOOTER
  doc.fontSize(10)
     .fill(azulOscuro)
     .text('¡Gracias por confiar en BlueFruit Nutrition!', 0, doc.page.height - 100, { 
       align: 'center', 
       width: doc.page.width 
     });
  
  doc.fontSize(8)
     .fill('gray')
     .text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 0, doc.page.height - 80, { 
       align: 'center', 
       width: doc.page.width 
     });

  doc.end();
};

//  Función para crear PDF para email (misma función, pero para archivo temporal)
const generarFacturaPDFParaEmail = (filePath, datosUsuario, datosCompra) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    //  MISMO DISEÑO QUE LA DESCARGA
    const azulOscuro = '#0C133F';
    const grisClaro = '#F8F9FA';

    // HEADER CON LOGO PARA EMAIL
    doc.rect(0, 0, doc.page.width, 120).fill(azulOscuro);
    
    // INTENTAR CARGAR LOGO PARA EMAIL TAMBIÉN
    const posiblesRutasLogo = [
      'public/bluefruit-logo.png',
      'public/Logo_Blue.png',
      'src/assets/images/Logo_Blue.png',
      'assets/Logo_Blue.png'
    ];

    let logoEncontrado = false;
    
    for (const rutaLogo of posiblesRutasLogo) {
      try {
        if (fs.existsSync(rutaLogo)) {
          doc.image(rutaLogo, 60, 25, { width: 60, height: 60 });
          logoEncontrado = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    

    // FALLBACK PARA EMAIL
    if (!logoEncontrado) {
      doc.fontSize(24).fill('white').text('🍃 BlueFruit', 60, 30);
      doc.fontSize(12).text('better nutrition', 60, 60);
      doc.fontSize(10).text('better results', 60, 75);
    } else {
      // Si hay logo, agregar texto al lado
      doc.fontSize(12).fill('white').text('better nutrition', 130, 40);
      doc.fontSize(10).text('better results', 130, 55);
    }
    
    doc.fontSize(28).fill('white').text('FACTURA', 350, 40, { width: 200, align: 'right' });
    
    const numeroOrden = datosCompra?.orden?.numeroOrden || `N°: ${Date.now().toString().slice(-6)}`;
    doc.rect(380, 70, 150, 30).stroke('white').strokeColor('white').lineWidth(2);
    doc.fontSize(12).fill('white').text(numeroOrden, 385, 82, { width: 140, align: 'center' });

    // Datos del cliente y empresa
    const leftColumnX = 60;
    const rightColumnX = 320;
    const sectionY = 150;
    
    doc.fontSize(14).fill(azulOscuro).font('Helvetica-Bold').text('DATOS DEL CLIENTE', leftColumnX, sectionY);
    doc.fontSize(10).fill('black').font('Helvetica')
       .text(`${datosUsuario.name || datosUsuario.companyName}`, leftColumnX, sectionY + 25)
       .text(`${datosUsuario.email}`, leftColumnX, sectionY + 40);

    doc.fontSize(14).fill(azulOscuro).font('Helvetica-Bold').text('DATOS DE LA EMPRESA', rightColumnX, sectionY);
    doc.fontSize(10).fill('black').font('Helvetica')
       .text('BlueFruit Nutrition', rightColumnX, sectionY + 25)
       .text('contacto@bluefruit.com', rightColumnX, sectionY + 40);

    // ORDEN Y FECHA EN LA MISMA LÍNEA TAMBIÉN EN EMAIL - PERFECTO ALINEAMIENTO
    const ordenY = sectionY + 80;
    const numeroOrdenFinal = datosCompra?.numeroOrden || datosCompra?.orden?.numeroOrden || `ORD-${Date.now().toString().slice(-6)}`;
    const fechaOrden = datosCompra?.fecha || datosCompra?.orden?.fecha || new Date().toLocaleDateString();
    
    // CONFIGURAR UNA SOLA VEZ Y USAR COORDENADAS EXACTAS
    doc.fontSize(12).fillColor(azulOscuro).font('Helvetica-Bold');
    doc.text(`Orden: ${numeroOrdenFinal}`, leftColumnX, ordenY);        // Izquierda
    doc.text(`Fecha: ${fechaOrden}`, leftColumnX + 250, ordenY);        // Derecha - MISMA Y

    // Productos simplificado para email
    const productosY = ordenY + 30;
    if (datosCompra?.productos && datosCompra.productos.length > 0) {
      doc.fontSize(12).fill(azulOscuro).font('Helvetica-Bold').text("PRODUCTOS COMPRADOS:", leftColumnX, productosY);
      
      let currentY = productosY + 20;
      datosCompra.productos.forEach(producto => {
        doc.fontSize(10).fill('black').font('Helvetica')
           .text(`- ${producto.nombre} x${producto.cantidad} = $${(producto.precio * producto.cantidad).toFixed(2)}`, leftColumnX, currentY);
        currentY += 15;
      });
      
      currentY += 10;
      doc.fontSize(14).fill(azulOscuro).font('Helvetica-Bold')
         .text(`TOTAL: $${datosCompra.total.toFixed(2)}`, 0, currentY, { align: 'right', width: doc.page.width - 60 });
    }

    doc.end();

    writeStream.on('finish', () => resolve());
    writeStream.on('error', (error) => reject(error));
  });
};

// CORREGIDA: Descargar factura manejando admin
export const descargarFactura = async (req, res) => {
  try {
    console.log('📄 Generando factura PDF...');
    console.log('Query params:', req.query);
    
    const { userId, tipo, datosCompra } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId es requerido" });
    }

    let datosUsuario;

    //  MANEJAR CASO ESPECIAL DEL ADMIN
    if (userId === "adminId") {
      console.log(' Usuario admin detectado, usando datos mock');
      datosUsuario = {
        name: "Administrador",
        email: config.emailAdmin?.email || "admin@bluefruit.com",
        phone: "+503 1234-5678",
        address: "Oficina Central - San Salvador, El Salvador"
      };
    } else {
      // Buscar usuario normal en la base de datos
      if (tipo === "cliente") {
        datosUsuario = await Cliente.findById(userId);
      } else if (tipo === "distribuidor") {
        datosUsuario = await Distribuidor.findById(userId);
      } else {
        return res.status(400).json({ message: "Tipo de usuario inválido" });
      }

      if (!datosUsuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    }

    // Parsear datos de compra si existen
    let datosCompraParsed = null;
    if (datosCompra) {
      try {
        datosCompraParsed = JSON.parse(datosCompra);
        console.log('✅ Datos de compra parseados:', datosCompraParsed);
      } catch (error) {
        console.error('Error parseando datos de compra:', error);
      }
    }

    console.log('✅ Generando PDF para usuario:', datosUsuario.email);
    generarFacturaPDF(res, datosUsuario, datosCompraParsed);
    
  } catch (error) {
    console.error("❌ Error generando factura:", error);
    res.status(500).json({ 
      message: "Error al generar factura", 
      error: error.message 
    });
  }
};

// ✅ CORREGIDA: Enviar factura por correo manejando admin
export const enviarFacturaEmail = async (req, res) => {
  try {
    console.log('📧 Enviando factura por email...');
    console.log('Body:', req.body);
    
    const { userId, tipo, datosCompra } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId es requerido" });
    }

    let datosUsuario;

    // ✅ MANEJAR CASO ESPECIAL DEL ADMIN
    if (userId === "adminId") {
      console.log('👑 Usuario admin detectado para email, usando datos mock');
      datosUsuario = {
        name: "Administrador",
        companyName: "BlueFruit Nutrition Admin",
        email: config.emailAdmin?.email || "admin@bluefruit.com",
        phone: "+503 1234-5678",
        address: "Oficina Central - San Salvador, El Salvador"
      };
    } else {
      // Buscar usuario normal en la base de datos
      if (tipo === "cliente") {
        datosUsuario = await Cliente.findById(userId);
      } else if (tipo === "distribuidor") {
        datosUsuario = await Distribuidor.findById(userId);
      } else {
        return res.status(400).json({ message: "Tipo de usuario inválido" });
      }

      if (!datosUsuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    }

    // Generar PDF temporal con el diseño profesional
    const timestamp = Date.now();
    const filePath = `factura_${userId}_${timestamp}.pdf`;

    // ✅ Usar la función mejorada para generar PDF
    await generarFacturaPDFParaEmail(filePath, datosUsuario, datosCompra);

    // Enviar email
    try {
      console.log('✅ PDF generado, enviando email...');
      
      const transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: config.email.email_user,
          pass: config.email.email_pass 
        },
      });

      await transporter.sendMail({
        from: '"BlueFruit Nutrition" <noreply@bluefruit.com>',
        to: datosUsuario.email,
        subject: "Tu factura de compra - BlueFruit Nutrition",
        text: "Adjuntamos tu factura de compra. ¡Gracias por confiar en nosotros!",
        html: `
          <h2>¡Gracias por tu compra!</h2>
          <p>Hola ${datosUsuario.name || datosUsuario.companyName},</p>
          <p>Adjuntamos la factura de tu reciente compra en BlueFruit Nutrition.</p>
          ${datosCompra?.orden ? `<p><strong>Número de orden:</strong> ${datosCompra.orden.numeroOrden}</p>` : ''}
          ${datosCompra?.total ? `<p><strong>Total:</strong> $${datosCompra.total.toFixed(2)}</p>` : ''}
          <p>¡Esperamos verte pronto!</p>
        `,
        attachments: [{ 
          filename: "factura_bluefruit.pdf", 
          path: filePath 
        }],
      });

      // Limpiar archivo temporal
      fs.unlinkSync(filePath);
      console.log(' Email enviado exitosamente');

      res.json({ message: "Factura enviada al correo exitosamente" });
    } catch (emailError) {
      console.error(" Error enviando email:", emailError);
      // Limpiar archivo en caso de error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(500).json({ 
        message: "Error al enviar email", 
        error: emailError.message 
      });
    }

  } catch (error) {
    console.error(" Error general enviando factura:", error);
    res.status(500).json({ 
      message: "Error al enviar factura", 
      error: error.message 
    });
  }
};
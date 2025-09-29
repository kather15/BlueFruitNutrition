// fixFlavors.js - Ejecutar una vez para arreglar datos existentes
import mongoose from 'mongoose';
import Products from './src/models/Products.js'; // Ajusta la ruta según tu estructura

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tu_database";

async function fixExistingFlavors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔗 Conectado a MongoDB');

    // Obtener todos los productos
    const products = await Products.find({});
    console.log(`📦 Encontrados ${products.length} productos`);

    for (const product of products) {
      let needsUpdate = false;
      let newFlavor = product.flavor;

      console.log(`\n🔍 Procesando: ${product.name}`);
      console.log(`🍎 Sabor actual:`, product.flavor);
      console.log(`🍎 Tipo actual:`, typeof product.flavor);

      // Si flavor es string, intentar convertir a array
      if (typeof product.flavor === 'string') {
        try {
          // Intentar parsear si es JSON string
          const parsed = JSON.parse(product.flavor);
          if (Array.isArray(parsed)) {
            newFlavor = parsed;
            needsUpdate = true;
            console.log(`✅ Parseado como JSON:`, newFlavor);
          } else {
            // Si es string simple, convertir a array
            newFlavor = [product.flavor];
            needsUpdate = true;
            console.log(`✅ Convertido a array:`, newFlavor);
          }
        } catch (error) {
          // Si no se puede parsear, tratar como string simple
          newFlavor = [product.flavor];
          needsUpdate = true;
          console.log(`✅ Tratado como string simple:`, newFlavor);
        }
      } else if (!Array.isArray(product.flavor)) {
        // Si no es string ni array, convertir a array
        newFlavor = [String(product.flavor)];
        needsUpdate = true;
        console.log(`✅ Convertido desde otro tipo:`, newFlavor);
      } else {
        console.log(`✅ Ya es array, no necesita cambios`);
      }

      // Limpiar el array (remover elementos vacíos)
      if (Array.isArray(newFlavor)) {
        const cleanedFlavor = newFlavor
          .map(f => String(f).trim())
          .filter(f => f.length > 0);
        
        if (JSON.stringify(cleanedFlavor) !== JSON.stringify(newFlavor)) {
          newFlavor = cleanedFlavor;
          needsUpdate = true;
          console.log(`✅ Limpiado:`, newFlavor);
        }
      }

      // Actualizar si es necesario
      if (needsUpdate) {
        await Products.findByIdAndUpdate(product._id, { flavor: newFlavor });
        console.log(`💾 ACTUALIZADO: ${product.name} → ${JSON.stringify(newFlavor)}`);
      } else {
        console.log(`⏭️ Sin cambios necesarios`);
      }
    }

    console.log('\n✅ Proceso completado!');
    
    // Verificar resultados
    console.log('\n🔍 Verificando resultados...');
    const updatedProducts = await Products.find({});
    for (const product of updatedProducts) {
      console.log(`${product.name}: ${JSON.stringify(product.flavor)} (${Array.isArray(product.flavor) ? 'ARRAY ✅' : 'NO ARRAY ❌'})`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar script
fixExistingFlavors();
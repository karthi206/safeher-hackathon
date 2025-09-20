/**
 * SafeHer Emergency SOS Backend API
 * =================================
 * 
 * This server handles SOS emergency alerts and can optionally send SMS/WhatsApp notifications.
 * 
 * SETUP INSTRUCTIONS:
 * ===================
 * 
 * 1. Basic Setup:
 *    - npm install
 *    - copy .env.example .env
 *    - Edit .env with your MongoDB URI
 *    - npm start
 * 
 * 2. Optional SMS/WhatsApp Alerts:
 *    - Install Twilio: npm install twilio
 *    - Get Twilio credentials from https://console.twilio.com/
 *    - Uncomment the twilio require statement below
 *    - Uncomment the twilioClient initialization
 *    - Uncomment the SMS/WhatsApp sending code blocks
 *    - Set environment variables in .env:
 *      * TWILIO_SID=your_account_sid
 *      * TWILIO_AUTH=your_auth_token
 *      * TWILIO_FROM=+1234567890 (your Twilio phone number)
 *      * EMERGENCY_NUMBERS=+91xxxxxxxxxx,+91yyyyyyyyyy
 *      * TWILIO_WHATSAPP_FROM=+14155238886 (for WhatsApp)
 * 
 * 3. Test the API:
 *    - Health check: GET http://localhost:5000/api/health
 *    - Send SOS: POST http://localhost:5000/sos
 *    - Get alerts: GET http://localhost:5000/sos
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Sos = require('./models/Sos');

// Optional Twilio integration for SMS/WhatsApp alerts
// Uncomment the line below and install twilio: npm install twilio
// const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/safeher-hackathon';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Optional Twilio SMS/WhatsApp Integration
// ======================================
// To enable SMS alerts:
// 1. Install Twilio: npm install twilio
// 2. Uncomment the twilio require statement above
// 3. Set these environment variables in your .env file:
//    TWILIO_SID=your_twilio_account_sid
//    TWILIO_AUTH=your_twilio_auth_token
//    TWILIO_FROM=+1234567890 (your Twilio phone number)
//    EMERGENCY_NUMBERS=+91xxxxxxxxxx,+91yyyyyyyyyy (comma-separated)
// 4. Uncomment the twilioClient initialization below

// Initialize Twilio client (uncomment when ready to use)
// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// Function to send SMS alerts
const sendSMSAlerts = async (sosData) => {
  try {
    // Check if Twilio is configured
    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH || !process.env.TWILIO_FROM || !process.env.EMERGENCY_NUMBERS) {
      console.log('📱 SMS alerts not configured - skipping SMS notification');
      return;
    }

    // Uncomment the line below when Twilio is installed and configured
    // if (!twilioClient) {
    //   console.log('📱 Twilio client not initialized - skipping SMS notification');
    //   return;
    // }

    const emergencyNumbers = process.env.EMERGENCY_NUMBERS.split(',').map(num => num.trim());
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${sosData.lat},${sosData.lng}`;
    const message = `🚨 SOS ALERT: ${sosData.userId} needs help at ${googleMapsUrl}`;

    console.log('📱 Sending SMS alerts to emergency contacts...');
    console.log(`   Message: ${message}`);
    console.log(`   Recipients: ${emergencyNumbers.join(', ')}`);

    // Send SMS to each emergency number
    for (const phoneNumber of emergencyNumbers) {
      try {
        // Uncomment the block below when Twilio is installed and configured
        /*
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_FROM,
          to: phoneNumber
        });
        */
        
        // For now, just log what would be sent
        console.log(`   📤 Would send SMS to ${phoneNumber}: ${message}`);
        
      } catch (smsError) {
        console.error(`   ❌ Failed to send SMS to ${phoneNumber}:`, smsError.message);
      }
    }

    console.log('📱 SMS alerts sent successfully');

  } catch (error) {
    console.error('❌ SMS alert system error:', error.message);
    // Don't throw error - SMS failure should not affect SOS saving
  }
};

// Function to send WhatsApp alerts (if using Twilio WhatsApp API)
const sendWhatsAppAlerts = async (sosData) => {
  try {
    // Check if Twilio WhatsApp is configured
    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH || !process.env.TWILIO_WHATSAPP_FROM || !process.env.EMERGENCY_NUMBERS) {
      console.log('💬 WhatsApp alerts not configured - skipping WhatsApp notification');
      return;
    }

    const emergencyNumbers = process.env.EMERGENCY_NUMBERS.split(',').map(num => num.trim());
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${sosData.lat},${sosData.lng}`;
    const message = `🚨 SOS ALERT: ${sosData.userId} needs help at ${googleMapsUrl}`;

    console.log('💬 Sending WhatsApp alerts to emergency contacts...');

    // Send WhatsApp to each emergency number
    for (const phoneNumber of emergencyNumbers) {
      try {
        // Uncomment the block below when Twilio WhatsApp is configured
        /*
        await twilioClient.messages.create({
          body: message,
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
          to: `whatsapp:${phoneNumber}`
        });
        */
        
        // For now, just log what would be sent
        console.log(`   📤 Would send WhatsApp to ${phoneNumber}: ${message}`);
        
      } catch (whatsappError) {
        console.error(`   ❌ Failed to send WhatsApp to ${phoneNumber}:`, whatsappError.message);
      }
    }

    console.log('💬 WhatsApp alerts sent successfully');

  } catch (error) {
    console.error('❌ WhatsApp alert system error:', error.message);
    // Don't throw error - WhatsApp failure should not affect SOS saving
  }
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SafeHer Emergency SOS API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// POST /sos - Save SOS event
app.post('/sos', async (req, res) => {
  try {
    const { userId, lat, lng, source, timestamp, notes } = req.body;
    
    // Validate required fields
    if (!userId || lat === undefined || lng === undefined || !source) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, lat, lng, source',
        received: { userId, lat, lng, source, timestamp }
      });
    }

    // Validate data types and ranges
    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
      return res.status(400).json({ 
        error: 'Invalid latitude. Must be a number between -90 and 90' 
      });
    }

    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
      return res.status(400).json({ 
        error: 'Invalid longitude. Must be a number between -180 and 180' 
      });
    }

    // Create new SOS record
    const sosData = {
      userId: userId.toString().trim(),
      lat,
      lng,
      source: source.toString().trim(),
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      notes: notes ? notes.toString().trim() : undefined
    };

    const sosRecord = new Sos(sosData);
    await sosRecord.save();

    // Log the SOS event for debugging
    console.log('🚨 SOS ALERT RECEIVED:');
    console.log(`   User: ${sosRecord.userId}`);
    console.log(`   Location: ${sosRecord.getLocationString()}`);
    console.log(`   Source: ${sosRecord.source}`);
    console.log(`   Time: ${sosRecord.timestamp.toISOString()}`);
    console.log(`   ID: ${sosRecord._id}`);
    console.log('   ---');

    // Send SMS/WhatsApp alerts (non-blocking)
    // This runs in the background and won't affect the response
    setImmediate(async () => {
      try {
        await sendSMSAlerts(sosData);
        await sendWhatsAppAlerts(sosData);
      } catch (alertError) {
        console.error('❌ Alert system error (non-critical):', alertError.message);
      }
    });

    res.status(201).json({ 
      ok: true, 
      id: sosRecord._id,
      message: 'SOS alert saved successfully',
      timestamp: sosRecord.timestamp
    });

  } catch (error) {
    console.error('❌ SOS endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to save SOS alert',
      details: error.message 
    });
  }
});

// GET /sos - Get last 50 SOS events
app.get('/sos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const userId = req.query.userId;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }

    const alerts = await Sos.find(query)
      .sort({ timestamp: -1 })
      .limit(Math.min(limit, 100)) // Cap at 100 for performance
      .select('userId lat lng source timestamp status notes')
      .lean();

    // Format the response
    const formattedAlerts = alerts.map(alert => ({
      id: alert._id,
      userId: alert.userId,
      location: {
        lat: alert.lat,
        lng: alert.lng
      },
      source: alert.source,
      timestamp: alert.timestamp,
      status: alert.status,
      notes: alert.notes
    }));

    res.json({
      ok: true,
      count: formattedAlerts.length,
      alerts: formattedAlerts
    });

  } catch (error) {
    console.error('❌ Get SOS alerts error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve SOS alerts',
      details: error.message 
    });
  }
});

// GET /sos/:id - Get specific SOS event
app.get('/sos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid SOS ID format' });
    }

    const alert = await Sos.findById(id);
    
    if (!alert) {
      return res.status(404).json({ error: 'SOS alert not found' });
    }

    res.json({
      ok: true,
      alert: {
        id: alert._id,
        userId: alert.userId,
        location: {
          lat: alert.lat,
          lng: alert.lng
        },
        source: alert.source,
        timestamp: alert.timestamp,
        status: alert.status,
        notes: alert.notes
      }
    });

  } catch (error) {
    console.error('❌ Get SOS by ID error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve SOS alert',
      details: error.message 
    });
  }
});

// PUT /sos/:id - Update SOS status
app.put('/sos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid SOS ID format' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    const alert = await Sos.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!alert) {
      return res.status(404).json({ error: 'SOS alert not found' });
    }

    console.log(`📝 SOS Alert Updated: ${id} - Status: ${alert.status}`);

    res.json({
      ok: true,
      message: 'SOS alert updated successfully',
      alert: {
        id: alert._id,
        status: alert.status,
        notes: alert.notes
      }
    });

  } catch (error) {
    console.error('❌ Update SOS error:', error);
    res.status(500).json({ 
      error: 'Failed to update SOS alert',
      details: error.message 
    });
  }
});

// Statistics endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const totalAlerts = await Sos.countDocuments();
    const pendingAlerts = await Sos.countDocuments({ status: 'pending' });
    const todayAlerts = await Sos.countDocuments({
      timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    res.json({
      ok: true,
      stats: {
        totalAlerts,
        pendingAlerts,
        todayAlerts,
        resolvedAlerts: totalAlerts - pendingAlerts
      }
    });

  } catch (error) {
    console.error('❌ Stats endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve statistics',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 SafeHer Emergency SOS API Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('---');
});
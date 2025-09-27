const ActiveSession = require('../../../models/ActiveSession');
const connectDB = require('../../../lib/mongodb');

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { action, sessionData, sessionId, userCategory } = req.body;

      switch (action) {
        case 'check_login':
          const loginCheck = await ActiveSession.canUserLogin(
            sessionData.userCategory, 
            sessionData.userId
          );
          
          return res.status(200).json({
            success: true,
            data: loginCheck
          });

        case 'create_session':
          const sessionResult = await ActiveSession.createSession({
            sessionId: sessionData.sessionId,
            userId: sessionData.userId,
            userType: sessionData.userType,
            userCategory: sessionData.userCategory,
            userName: sessionData.userName,
            ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
          });
          
          return res.status(200).json({
            success: sessionResult.success,
            data: sessionResult
          });

        case 'terminate_session':
          const terminateResult = await ActiveSession.terminateSession(sessionId);
          
          return res.status(200).json({
            success: terminateResult.success,
            data: terminateResult
          });

        case 'force_logout_category':
          const forceLogoutResult = await ActiveSession.forceLogoutCategory(userCategory);
          
          return res.status(200).json({
            success: forceLogoutResult.success,
            data: forceLogoutResult
          });

        case 'get_active_sessions':
          const activeSessions = await ActiveSession.find({
            isActive: true,
            expiresAt: { $gt: new Date() }
          }).select('sessionId userId userType userCategory userName loginTime lastActivity');
          
          return res.status(200).json({
            success: true,
            data: {
              sessions: activeSessions,
              count: activeSessions.length,
              nominee: activeSessions.filter(s => s.userCategory === 'nominee'),
              admin: activeSessions.filter(s => s.userCategory === 'admin')
            }
          });

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid action'
          });
      }

    } catch (error) {
      console.error('Session management error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}
const { pool } = require('../utils/db');
const { userSchema } = require('../models/userModel');
const { ApiError } = require('../utils/apiError');
const { logger } = require('../utils/logger');
const crypto = require('crypto');
const fs = require('fs');

// Load RSA keys (replace with your key file paths or environment variables)
const publicKey = fs.readFileSync('public.pem', 'utf8');
const privateKey = fs.readFileSync('private.pem', 'utf8');

// Hash function using SHA-256
function hashEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

// Encryption/Decryption utility functions using RSA
function encrypt(data) {
  try {
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(data)
    );
    return encryptedData.toString('base64');
  } catch (error) {
    logger.error('Encryption error: ', error);
    throw new ApiError(500, 'Error encrypting data');
  }
}

function decrypt(encryptedData) {
  try {
    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptedData, 'base64')
    );
    return decryptedData.toString('utf8');
  } catch (error) {
    logger.error('Decryption error: ', error);
    throw new ApiError(500, 'Error decrypting data');
  }
}

class UserService {
  
  async addUser(userData) {
    try {
      const { error } = userSchema.validate(userData);
      if (error) {
        throw new ApiError(400, error.details[0].message);
      }
  
      const hashedEmail = hashEmail(userData.email);  // Hash the email before checking
      const [existingUser] = await pool.query('SELECT * FROM users WHERE email_hash = ?', [hashedEmail]);
  
      if (existingUser.length) {
        throw new ApiError(409, 'Email already registered');
      }
  
      const encryptedname = encrypt(userData.name);
      const encryptedEmail = encrypt(userData.email);  // Encrypt the email for storage
  
      // Save the hashed email along with the encrypted email
      const [result] = await pool.query(
        'INSERT INTO users (name, email, email_hash, role) VALUES (?, ?, ?, ?)',
        [encryptedname, encryptedEmail, hashedEmail, userData.role]
      );
  
      return { id: result.insertId, ...userData };
    } catch (error) {
      logger.error('Error adding user: ', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Internal server error');
    }
  }
  

  async getAllUsers() {
    try {
      const [users] = await pool.query('SELECT * FROM users');
      
      // Decrypt the user data
      const decryptedUsers = users.map(user => ({
        id: user.id,
        name: decrypt(user.name),
        email: decrypt(user.email),
        role: user.role,
        created_at: user.created_at, // Assuming `created_at` is not encrypted
      }));
      
      return decryptedUsers;
    } catch (error) {
      logger.error('Error fetching all users: ', error);
      throw new ApiError(500, 'Unable to fetch users');
    }
  }  

  async getAllUsersByRole(Role) {
    try {
      const [users] = await pool.query('SELECT * FROM users where role = ?', [Role]);
      
      // Decrypt the user data
      const decryptedUsers = users.map(user => ({
        id: user.id,
        name: decrypt(user.name),
        email: decrypt(user.email),
        role: user.role,
        created_at: user.created_at, // Assuming `created_at` is not encrypted
      }));
      
      return decryptedUsers;
    } catch (error) {
      logger.error('Error fetching all users: ', error);
      throw new ApiError(500, 'Unable to fetch users');
    }
  }  
  
  async deleteUser(userId) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
      if (!result.affectedRows) {
        throw new ApiError(404, 'User not found');
      }
      return true;
    } catch (error) {
      logger.error('Error deleting user: ', error);
      throw error instanceof ApiError ? error : new ApiError(500, 'Internal server error');
    }
  }
}



module.exports = new UserService();

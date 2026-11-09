const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const env = require('../config/env');
const { v4: uuidv4 } = require('uuid');

class AuthService {
  async register({ organization_name, email, password, first_name, last_name, role = 'ADMIN' }) {
    return await db.transaction(async (trx) => {
      // 1. Create or fetch organization
      let org = await trx('organizations').where({ code: organization_name.toLowerCase().replace(/\s+/g, '-') }).first();
      
      if (!org) {
        const [newOrgId] = await trx('organizations').insert({
          id: uuidv4(),
          name: organization_name,
          code: organization_name.toLowerCase().replace(/\s+/g, '-'),
          industry: 'Retail'
        }).returning('id');

        org = { id: typeof newOrgId === 'object' ? newOrgId.id : newOrgId, name: organization_name };
      }

      const orgId = org.id;

      // 2. Check if user email exists in this organization
      const existingUser = await trx('users').where({ organization_id: orgId, email }).first();
      if (existingUser) {
        throw new Error('User email already registered for this organization');
      }

      // 3. Hash password
      const password_hash = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      await trx('users').insert({
        id: userId,
        organization_id: orgId,
        email,
        password_hash,
        first_name,
        last_name,
        role: role.toUpperCase()
      });

      const token = jwt.sign(
        { user_id: userId, organization_id: orgId, role: role.toUpperCase(), email },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
      );

      return {
        token,
        user: {
          id: userId,
          organization_id: orgId,
          email,
          first_name,
          last_name,
          role: role.toUpperCase()
        }
      };
    });
  }

  async login({ email, password, organization_id }) {
    let query = db('users').where({ email });
    if (organization_id) {
      query = query.andWhere({ organization_id });
    }

    const user = await query.first();
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('User account is deactivated');
    }

    const token = jwt.sign(
      { user_id: user.id, organization_id: user.organization_id, role: user.role, email: user.email },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        organization_id: user.organization_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    };
  }

  async getUserById(userId, organizationId) {
    const user = await db('users')
      .where({ id: userId, organization_id: organizationId })
      .select('id', 'organization_id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at')
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const org = await db('organizations').where({ id: organizationId }).first();
    user.organization_name = org ? org.name : null;

    return user;
  }
}

module.exports = new AuthService();

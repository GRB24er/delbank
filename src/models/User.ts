// File: src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  verified: boolean;

  // Three separate account balances
  checkingBalance: number;
  savingsBalance: number;
  investmentBalance: number;

  // Account details
  accountNumber?: string;
  routingNumber?: string;
  phone?: string;

  // KYC / profile metadata stored at registration
  metadata?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    nationality?: string;
    identification?: {
      type?: string;
      number?: string;
    };
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
    phone?: string;
    employment?: {
      status?: string;
      monthlyIncome?: string;
    };
    accountPurpose?: string;
    consents?: {
      terms?: boolean;
      privacy?: boolean;
      marketing?: boolean;
    };
  };

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  verified: {
    type: Boolean,
    default: false,
  },

  // Balances
  checkingBalance: { type: Number, default: 0 },
  savingsBalance:  { type: Number, default: 0 },
  investmentBalance: { type: Number, default: 0 },

  // Account identifiers
  accountNumber: { type: String },
  routingNumber: { type: String },
  phone: { type: String },

  // KYC / profile metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      ret._id = ret._id.toString() as any;
      delete (ret as any).password;
      delete (ret as any).__v;
      return ret;
    },
  },
});

// ── Password hashing ──────────────────────────────────────────────────────────
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

// ── Auto-generate account & routing numbers (cryptographically secure) ────────
UserSchema.pre<IUser>('save', function (next) {
  if (!this.accountNumber) {
    const rand = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    this.accountNumber = 'AC' + String(rand).padStart(9, '0').slice(0, 9);
  }
  if (!this.routingNumber) {
    const rand = parseInt(crypto.randomBytes(4).toString('hex'), 16);
    this.routingNumber = 'RT' + String(rand).padStart(9, '0').slice(0, 9);
  }
  // Mirror phone from metadata if not set at top level
  if (!this.phone && this.metadata?.phone) {
    this.phone = this.metadata.phone;
  }
  next();
});

// ── Password comparison ───────────────────────────────────────────────────────
UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;

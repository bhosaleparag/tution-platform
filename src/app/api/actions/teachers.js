'use server';
import crypto from 'crypto';
import { adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Create teacher invite and send email
export async function createTeacherInvite(formData) {
  try {
    // 1. Generate token and expiry
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 2. Check if teacher user already exists
    const existingTeacher = await adminDb.collection('users')
      .where('email', '==', formData.email)
      .where('role', '==', 'teacher')
      .get();

    if (!existingTeacher.empty) {
      return {
        success: false,
        error: 'A teacher with this email already exists'
      };
    }

    // 3. Store invite (not user)
    await adminDb.collection('invites').doc(inviteToken).set({
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      role: 'teacher',
      instituteId: formData.instituteId,
      token: inviteToken,
      expiresAt,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 4. Invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register/teacher?token=${inviteToken}`;

    // 5. Send email
    await sendInviteEmail({
      to: formData.email,
      name: formData.name,
      inviteLink,
      expiresAt,
    });

    return {
      success: true,
      inviteToken: inviteToken,
      message: 'Invite sent successfully!'
    };

  } catch (error) {
    console.error('Error creating teacher invite:', error);
    return {
      success: false,
      error: 'Failed to create invite. Please try again.'
    };
  }
}

// Resend teacher invite
export async function resendTeacherInvite(inviteToken) {
  try {
    // 1. Fetch invite document
    const inviteDoc = await adminDb.collection('invites').doc(inviteToken).get();
    if (!inviteDoc.exists) {
      return { success: false, error: 'Invite not found' };
    }

    const invite = inviteDoc.data();

    // 2. Generate a new token
    const newToken = crypto.randomBytes(32).toString('hex');
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    // 3. Move invite to new token doc
    await adminDb.collection('invites').doc(newToken).set({
      ...invite,
      token: newToken,
      expiresAt: newExpiresAt,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 4. Delete old invite document
    await adminDb.collection('invites').doc(inviteToken).delete();

    // 5. New invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register/teacher?token=${newToken}`;

    // 6. Send email again
    await sendInviteEmail({
      to: invite.email,
      name: invite.name,
      inviteLink,
      expiresAt: newExpiresAt,
      isResend: true
    });

    return {
      success: true,
      newToken,
      message: "Invite resent successfully!"
    };

  } catch (error) {
    console.error("Error resending invite:", error);
    return {
      success: false,
      error: "Failed to resend invite"
    };
  }
}

// Helper function to send email
async function sendInviteEmail({ to, name, inviteLink, expiresAt, isResend = false }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      name,
      inviteLink,
      expiresAt: expiresAt.toISOString(),
      isResend
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}
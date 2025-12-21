import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Fetch all registered teachers
export async function fetchTeachers() {
  const teachersRef = collection(db, 'users');
  const q = query(teachersRef, where('role', '==', 'teacher'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ 
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toMillis() || null,
    subscriptionExpiry: doc.data().subscriptionExpiry?.toMillis() || null
  }));
}

// Fetch only active registered teachers
export async function fetchActiveTeachers() {
  const teachersRef = collection(db, 'users');
  const q = query(
    teachersRef, 
    where('role', '==', 'teacher'),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch invited teachers (who have not registered yet)
export async function fetchInvitedTeachers() {
  const invitesRef = collection(db, 'invites');
  const snapshot = await getDocs(invitesRef);

  return snapshot.docs.map(doc => ({
    token: doc.id,
    ...doc.data(),
    expiresAt: doc.data().expiresAt?.toMillis() || null,
    createdAt: doc.data().createdAt?.toMillis() || null
  }));
}

// Get invite by token
export async function getInviteByToken(token) {
  const inviteRef = doc(db, 'invites', token);
  const inviteDoc = await getDoc(inviteRef);

  if (!inviteDoc.exists()) return null;

  return { token, ...inviteDoc.data() };
}

// Get registered teacher
export async function getTeacherById(teacherId) {
  const teacherRef = doc(db, 'users', teacherId);
  const teacherDoc = await getDoc(teacherRef);
  if (!teacherDoc.exists()) return null;

  return { id: teacherDoc.id, ...teacherDoc.data() };
}

// Update registered teacher
export async function updateTeacher(teacherId, data) {
  const teacherRef = doc(db, 'users', teacherId);
  await updateDoc(teacherRef, {
    name: data.name,
    email: data.email,
    contact: data.contact,
    instituteId: data.instituteId,
    isActive: data.isActive
  });
}

// Delete teacher (registered)
export async function deleteTeacher(teacherId) {
  const teacherRef = doc(db, 'users', teacherId);
  await deleteDoc(teacherRef);
}

export async function deleteInvite(token) {
  const inviteRef = doc(db, 'invites', token);
  await deleteDoc(inviteRef);
}

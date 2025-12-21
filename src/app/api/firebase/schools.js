import { db } from '@/lib/firebase';
import { query } from 'firebase/database';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, where, getDoc } from 'firebase/firestore';

// Fetch all schools
export async function fetchSchools() {
  const schoolsRef = collection(db, 'institutes');
  const snapshot = await getDocs(schoolsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch school by Id
export async function fetchSchool(id) {
  const schoolRef = doc(db, 'institutes', id);
  const snapshot = await getDoc(schoolRef);
  if (!snapshot.exists()) {
    return null; // or throw error
  }
  return { id: snapshot.id, ...snapshot.data() };
}

// Add new school
export async function addSchool(data, adminId) {
  const schoolsRef = collection(db, 'institutes');
  const docRef = await addDoc(schoolsRef, {
    name: data.name,
    isActive: data.isActive,
    ownerAdminId: adminId,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Update school
export async function updateSchool(schoolId, data) {
  const schoolRef = doc(db, 'institutes', schoolId);
  await updateDoc(schoolRef, {
    name: data.name,
    isActive: data.isActive
  });
}

// Delete school
export async function deleteSchool(schoolId) {
  const schoolRef = doc(db, 'institutes', schoolId);
  await deleteDoc(schoolRef);
}

// Fetch active institutes only
export async function fetchActiveInstitutes() {
  const institutesRef = collection(db, 'institutes');
  const q = query(institutesRef, where('isActive', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
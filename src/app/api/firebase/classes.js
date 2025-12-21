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
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';

// Fetch all classes by institute
export async function fetchClassesByInstitute(instituteId) {
  const classesRef = collection(db, 'classes');
  const q = query(classesRef, where('instituteId', '==', instituteId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    createdAt: doc.data().createdAt?.toMillis() || Date.now()
  }));
}

// Fetch classes where teacher is added
export async function fetchTeacherClasses(instituteId, teacherId) {
  const classesRef = collection(db, 'classes');
  const q = query(
    classesRef, 
    where('instituteId', '==', instituteId),
    where('teachers', 'array-contains', teacherId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Create new class
export async function createClass(data, teacherId, instituteId) {
  const classesRef = collection(db, 'classes');
  
  // Generate unique code
  const code = generateClassCode(data.title, data.section);
  
  const docRef = await addDoc(classesRef, {
    instituteId: instituteId,
    title: data.title,
    section: data.section || null,
    code: code,
    createdBy: teacherId,
    teachers: [teacherId],
    subjects: data.subjects,
    studentsCount: 0,
    isActive: data.isActive,
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
}

// Update class
export async function updateClass(classId, data) {
  const classRef = doc(db, 'classes', classId);
  await updateDoc(classRef, {
    title: data.title,
    section: data.section || null,
    subjects: data.subjects,
    isActive: data.isActive
  });
}

// Delete class
export async function deleteClass(classId) {
  const classRef = doc(db, 'classes', classId);
  await deleteDoc(classRef);
}

// Add teacher to class
export async function addTeacherToClass(classId, teacherId) {
  const classRef = doc(db, 'classes', classId);
  await updateDoc(classRef, {
    teachers: arrayUnion(teacherId)
  });
}

// Helper: Generate unique class code
function generateClassCode(title, section) {
  const prefix = title.replace(/\s+/g, '').toUpperCase().substring(0, 4);
  const sectionCode = section ? section.toUpperCase().replace(/\s+/g, '').substring(0, 2) : '';
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${sectionCode}${random}`;
}

// Check if code is unique (optional - for extra safety)
export async function isClassCodeUnique(code) {
  const classesRef = collection(db, 'classes');
  const q = query(classesRef, where('code', '==', code));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  or,
  Firestore,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { createId } from '@paralleldrive/cuid2';

import { firestore } from './firebase';

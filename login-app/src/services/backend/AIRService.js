// AIR (Ahli Isi Rumah) Service for managing household members
import { db } from '../database/firebase.js';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { COLLECTIONS, addStandardFields, createEnvFilter } from '../database/collections.js';

export class AIRService {
  static COLLECTION_NAME = COLLECTIONS.KIR_AIR;

  /**
   * Get all AIR records for a specific KIR
   * @param {string} kirId - The KIR ID
   * @returns {Promise<Array>} Array of AIR records
   */
  static async listAIR(kirId) {
    try {
      if (!kirId) {
        throw new Error('KIR ID is required');
      }

      const airQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('kir_id', '==', kirId),
        createEnvFilter(),
        orderBy('tarikh_cipta', 'desc')
      );

      const querySnapshot = await getDocs(airQuery);
      const airList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        airList.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to readable dates
          tarikh_cipta: data.tarikh_cipta?.toDate?.() || data.tarikh_cipta,
          tarikh_kemas_kini: data.tarikh_kemas_kini?.toDate?.() || data.tarikh_kemas_kini,
          tarikh_lahir: data.tarikh_lahir?.toDate?.() || data.tarikh_lahir
        });
      });

      return airList;
    } catch (error) {
      console.error('Error fetching AIR list:', error);
      throw error;
    }
  }

  // Backward compatibility alias
  static async getAIRByKIRId(kirId) {
    return this.listAIR(kirId);
  }

  /**
   * Create a new AIR record
   * @param {string} kirId - The KIR ID
   * @param {Object} payload - AIR data
   * @returns {Promise<string>} Created AIR document ID
   */
  static async createAIR(kirId, payload) {
    try {
      if (!kirId) {
        throw new Error('KIR ID is required');
      }

      if (!payload.nama) {
        throw new Error('Nama is required');
      }

      const now = Timestamp.now();
      
      // Prepare the document data
      const airData = addStandardFields({
        kir_id: kirId,
        ...payload,
        // Convert date strings to Firestore timestamps if needed
        tarikh_lahir: payload.tarikh_lahir ? 
          (payload.tarikh_lahir instanceof Date ? 
            Timestamp.fromDate(payload.tarikh_lahir) : 
            Timestamp.fromDate(new Date(payload.tarikh_lahir))
          ) : null,
        tarikh_cipta: now,
        tarikh_kemas_kini: now
      });

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), airData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating AIR:', error);
      throw error;
    }
  }

  /**
   * Update an existing AIR record
   * @param {string} airId - The AIR document ID
   * @param {Object} payload - Updated AIR data
   * @returns {Promise<void>}
   */
  static async updateAIR(airId, payload) {
    try {
      if (!airId) {
        throw new Error('AIR ID is required');
      }

      const airRef = doc(db, this.COLLECTION_NAME, airId);
      
      // Check if document exists
      const airDoc = await getDoc(airRef);
      if (!airDoc.exists()) {
        throw new Error('AIR record not found');
      }

      // Prepare update data
      const updateData = {
        ...payload,
        // Convert date strings to Firestore timestamps if needed
        tarikh_lahir: payload.tarikh_lahir ? 
          (payload.tarikh_lahir instanceof Date ? 
            Timestamp.fromDate(payload.tarikh_lahir) : 
            Timestamp.fromDate(new Date(payload.tarikh_lahir))
          ) : undefined,
        tarikh_kemas_kini: Timestamp.now()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await updateDoc(airRef, updateData);
    } catch (error) {
      console.error('Error updating AIR:', error);
      throw error;
    }
  }

  /**
   * Delete an AIR record
   * @param {string} airId - The AIR document ID
   * @returns {Promise<void>}
   */
  static async deleteAIR(airId) {
    try {
      if (!airId) {
        throw new Error('AIR ID is required');
      }

      const airRef = doc(db, this.COLLECTION_NAME, airId);
      
      // Check if document exists
      const airDoc = await getDoc(airRef);
      if (!airDoc.exists()) {
        throw new Error('AIR record not found');
      }

      await deleteDoc(airRef);
    } catch (error) {
      console.error('Error deleting AIR:', error);
      throw error;
    }
  }

  /**
   * Get a single AIR record by ID
   * @param {string} airId - The AIR document ID
   * @returns {Promise<Object|null>} AIR record or null if not found
   */
  static async getAIRById(airId) {
    try {
      if (!airId) {
        throw new Error('AIR ID is required');
      }

      const airRef = doc(db, this.COLLECTION_NAME, airId);
      const airDoc = await getDoc(airRef);

      if (!airDoc.exists()) {
        return null;
      }

      const data = airDoc.data();
      return {
        id: airDoc.id,
        ...data,
        // Convert Firestore timestamps to readable dates
        tarikh_cipta: data.tarikh_cipta?.toDate?.() || data.tarikh_cipta,
        tarikh_kemas_kini: data.tarikh_kemas_kini?.toDate?.() || data.tarikh_kemas_kini,
        tarikh_lahir: data.tarikh_lahir?.toDate?.() || data.tarikh_lahir
      };
    } catch (error) {
      console.error('Error getting AIR by ID:', error);
      throw error;
    }
  }

  // Helper methods
  static calculateAge(birthDate) {
    if (!birthDate) return 'N/A';
    
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      return 'N/A';
    }
  }

  static formatDate(dateString) {
    if (!dateString) return 'Tiada';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Tarikh tidak sah';
    }
  }
}

import { query, collection, onSnapshot, setDoc, updateDoc, deleteDoc, doc, Unsubscribe, getDocs } from "@firebase/firestore";
import { where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { IFolder } from "../models/Folder";
import { IScorecardBatch } from "../models/ScorecardBatch";
import AppStore from "../stores/AppStore";
import AppApi, { apiPathCompanyLevel } from "./AppApi";

export default class ScorecardApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private getPath() {
    return apiPathCompanyLevel("scorecards");
  }

  async getActive() {
    const path = this.getPath();
    if (!path) return;
    const $query = query(collection(db, path), where("active", "==", true));
    try {
      const docsSnap = await getDocs($query);
      if (docsSnap.empty) {
        this.store.scorecard.clearActive();
      } else {
        const item = {
          id: docsSnap.docs[0].id,
          ...docsSnap.docs[0].data(),
        } as IScorecardBatch;
        this.store.scorecard.setActive(item); // set active in store
        this.createOrUpdateFYFolder(item); // create/update FY folder in drive
      }
    } catch (error) { }
  }


  // for dublicating testing, duplicatess to the curent scorecard
  async getCurrent() {
    const path = this.getPath();
    if (!path) return;
    const $query = query(collection(db, path), where("current", "==", true));
    try {
      const docsSnap = await getDocs($query);
      if (docsSnap.empty) {
        this.store.scorecard.clearCurrent();
      } else {
        const item = {
          id: docsSnap.docs[0].id,
          ...docsSnap.docs[0].data(),
        } as IScorecardBatch;
        this.store.scorecard.setCurrent(item); // set current in store
        // console.log(item);

      }
    } catch (error) { }
  }


  async getAll() {
    const path = this.getPath();
    if (!path) return;

    const $query = query(collection(db, path));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const items: IScorecardBatch[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IScorecardBatch);
        });
        this.store.scorecard.load(items);
        resolve(unsubscribe);
      }, (error) => {
        reject();
      }
      );
    });
  }

  async getById(id: string) {
    const path = this.getPath();
    if (!path) return;

    const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IScorecardBatch;

      this.store.scorecard.load([item]);
    });

    return unsubscribe;
  }

  // create scorecardBatch
  async create(item: IScorecardBatch) {
    const path = this.getPath();
    if (!path) return;

    const itemRef = doc(collection(db, path));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, { merge: true });
      // create in store
      this.store.scorecard.load([item]);
    } catch (error) { }
  }

  // update item
  async update(item: IScorecardBatch) {
    const path = this.getPath();
    if (!path) return;

    // update in db
    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      // update in store
      this.store.scorecard.load([item]);
    } catch (error) { }
  }

  // delete scorecard batch
  async delete(item: IScorecardBatch) {
    const path = this.getPath();
    if (!path) return;

    // remove from db
    try {
      await deleteDoc(doc(db, path, item.id));
      // remove from store
      this.store.scorecard.remove(item.id); // Remove from memory
    } catch (error) { }
  }

  //duplicate company
  async duplicateScorecard(currentScorecardId: string, selectedScorecardId: string) {
    const path = this.getPath();
    if (!path) return;

    // Retrieve data from the subcollections of the selected scorecard
    const selectedScorecardDocRef = doc(db, path, selectedScorecardId);


    // Retrieve data from companyObjectives subcollection of the selected scorecard
    const companyObjectivesSnapshot = await getDocs(collection(selectedScorecardDocRef, 'companyObjectives'));

    const companyObjectivesData = companyObjectivesSnapshot.docs.map(doc => {
      let objectiveData = { id: doc.id, draftComment: "", midComment: "", assessComment: "", createAt: Date.now(), ...doc.data() };
      // Clear specific fields if needed
      objectiveData.draftComment = ""; // For example, setting a field to null
      objectiveData.midComment = ""; // For example, setting a field to null
      objectiveData.assessComment = ""; // For example, setting a field to null
      objectiveData.createAt = Date.now()
      return objectiveData;
    });

    // Retrieve data from companyMeasures subcollection of the selected scorecard
    const companyMeasuresSnapshot = await getDocs(collection(selectedScorecardDocRef, 'companyMeasures'));
    // const companyMeasuresData = companyMeasuresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const companyMeasuresData = companyMeasuresSnapshot.docs.map(doc => {
      let measureData = {
        id: doc.id, comments: "", midtermComments: "",
        assessmentComments: " ", activities: "",
        quarter1Actual: 0,
        quarter2Actual: 0,
        quarter3Actual: 0,
        quarter4Actual: 0,
        sourceOfEvidence: "",
        targetDate: "",
        supervisorRating: null,
        supervisorRating2: null,

        finalRating: null,
        finalRating2: null,

        autoRating: 0,
        autoRating2: 0,
        isUpdated: false,

        statusUpdate: "",
        annualActual: null,

        quarter1Target: null,
        quarter2Target: null,
        quarter3Target: null,
        quarter4Target: null,


        rating: 0,
        q2supervisorRating: null,
        q2FinalRating: null,
        q4rating: 0,
        q4supervisorRating: null,
        q4FinalRating: null,
        ...doc.data()
      };
      // Clear specific fields if needed
      measureData.comments = ""; // For example, setting a field to an empty string
      measureData.midtermComments = ""; // For example, setting a field to an empty string
      measureData.assessmentComments = ""; // For example, setting a field to an empty string
      measureData.activities = ""; // For example, setting a field to an empty string
      measureData.quarter1Actual = 0;
      measureData.quarter2Actual = 0;
      measureData.quarter3Actual = 0;
      measureData.quarter4Actual = 0;
      measureData.sourceOfEvidence = "";
      measureData.targetDate = "";
      measureData.supervisorRating = null;
      measureData.supervisorRating2 = null;
      measureData.finalRating = null;
      measureData.finalRating2 = null;
      measureData.autoRating = 0;
      measureData.autoRating2 = 0;
      measureData.isUpdated = false;
      measureData.annualActual = null;
      measureData.statusUpdate = "";
      measureData.rating = 0;
      measureData.q2supervisorRating = null;
      measureData.q2FinalRating = null;
      measureData.q4supervisorRating = null;
      measureData.q4FinalRating = null;
      measureData.q4rating = 0;

      return measureData;
    });
    // Write data to the corresponding subcollections of the current scorecard
    const currentScorecardDocRef = doc(db, path, currentScorecardId);

    // Write data to companyMeasureAudits subcollection of the current scorecard
    // Write data to companyMeasureAudits subcollection of the current scorecard

    // Write data to companyObjectives subcollection of the current scorecard
    companyObjectivesData.forEach(async data => {
      await setDoc(doc(collection(currentScorecardDocRef, 'companyObjectives'), data.id), data);
    });

    // Write data to companyMeasures subcollection of the current scorecard
    companyMeasuresData.forEach(async data => {
      await setDoc(doc(collection(currentScorecardDocRef, 'companyMeasures'), data.id), data);
    });

  }

  //Duplicate individual
  async duplicateScorecardInvidivual(currentScorecardId: string, selectedScorecardId: string, uid: string) {
    const path = this.getPath();
    if (!path) return;

    // Retrieve data from the subcollections of the selected scorecard
    const selectedScorecardDocRef = doc(db, path, selectedScorecardId);

    // Retrieve data from companyObjectives subcollection of the selected scorecard where uid matches
    const companyObjectivesQuerySnapshot = await getDocs(query(collection(selectedScorecardDocRef, 'objectives'), where('uid', '==', uid)));
    const companyObjectivesData = companyObjectivesQuerySnapshot.docs.map(doc => {
      let objectiveData = { id: doc.id, draftComment: "", midComment: "", assessComment: "", ...doc.data() };
      // Clear specific fields if needed
      objectiveData.draftComment = ""; // For example, setting a field to null
      objectiveData.midComment = ""; // For example, setting a field to null
      objectiveData.assessComment = ""; // For example, setting a field to null
      return objectiveData;
    });

    // Retrieve data from companyMeasures subcollection of the selected scorecard where uid matches
    const companyMeasuresQuerySnapshot = await getDocs(query(collection(selectedScorecardDocRef, 'measures'), where('uid', '==', uid)));
    const companyMeasuresData = companyMeasuresQuerySnapshot.docs.map(doc => {
      let measureData = {
        id: doc.id, comments: "", midtermComments: "",
        assessmentComments: " ", activities: "",
        quarter1Actual: 0,
        quarter2Actual: 0,
        quarter3Actual: 0,
        quarter4Actual: 0,
        sourceOfEvidence: "",
        targetDate: "",
        supervisorRating: null,
        supervisorRating2: null,

        finalRating: null,
        finalRating2: null,

        autoRating: 0,
        autoRating2: 0,
        isUpdated: false,

        ...doc.data()
      };
      // Clear specific fields if needed
      measureData.comments = ""; // For example, setting a field to an empty string
      measureData.midtermComments = ""; // For example, setting a field to an empty string
      measureData.assessmentComments = ""; // For example, setting a field to an empty string
      measureData.activities = ""; // For example, setting a field to an empty string
      measureData.quarter1Actual = 0;
      measureData.quarter2Actual = 0;
      measureData.quarter3Actual = 0;
      measureData.quarter4Actual = 0;
      measureData.sourceOfEvidence = "";
      measureData.targetDate = "";
      measureData.supervisorRating = null;
      measureData.supervisorRating2 = null;
      measureData.finalRating = null;
      measureData.finalRating2 = null;
      measureData.autoRating = 0;
      measureData.autoRating2 = 0;
      measureData.isUpdated = false;

      return measureData;
    });

    // Write data to the corresponding subcollections of the current scorecard
    const currentScorecardDocRef = doc(db, path, currentScorecardId);

    // Write data to companyObjectives subcollection of the current scorecard
    companyObjectivesData.forEach(async data => {
      await setDoc(doc(collection(currentScorecardDocRef, 'objectives'), data.id), data);
    });

    // Write data to companyMeasures subcollection of the current scorecard
    companyMeasuresData.forEach(async data => {
      await setDoc(doc(collection(currentScorecardDocRef, 'measures'), data.id), data);
    });
  }


  // create/update department root folder in drive
  private async createOrUpdateFYFolder(item: IScorecardBatch) {
    const user = this.store.auth.meJson;
    if (!user) return; // TODO: handle no user error.

    const fyFolder: IFolder = {
      id: `${user.uid}_${item.id}`,
      name: `FY ${item.description}`,
      type: "FY",
      department: user.department,
      parentId: user.uid,
      path: ["root", user.department, user.uid],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const financialPerspectiveFolder: IFolder = {
      id: `financial_${user.uid}_${item.id}`,
      name: `Financial Sustainability`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const learningPerspectiveFolder: IFolder = {
      id: `learning_${user.uid}_${item.id}`,
      name: `Human Capital & Transformation`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const processPerspectiveFolder: IFolder = {
      id: `process_${user.uid}_${item.id}`,
      name: `Operational Excellence & Governance`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    const customerPerspectiveFolder: IFolder = {
      id: `customer_${user.uid}_${item.id}`,
      name: `Stakeholder Value Addition`,
      type: "Perspective",
      department: user.department,
      parentId: `${user.uid}_${item.id}`,
      path: ["root", user.department, user.uid, `${user.uid}_${item.id}`],
      createdBy: "auto",
      createdAt: Date.now(),
      supervisor: user.supervisor,
    };

    // create in db
    try {
      await this.api.folder.autoCreateFolder(fyFolder);
      // create sub folders
      await this.api.folder.autoCreateFolder(financialPerspectiveFolder);
      await this.api.folder.autoCreateFolder(learningPerspectiveFolder);
      await this.api.folder.autoCreateFolder(processPerspectiveFolder);
      await this.api.folder.autoCreateFolder(customerPerspectiveFolder);
    } catch (error) {
      // console.log(error);
    }
  }




}

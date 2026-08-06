export interface FirestoreDocument {
  name?: string;
  fields?: Record<string, unknown>;
  createTime?: string;
  updateTime?: string;
}

export interface FirestoreListResponse {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
}

export interface Member {
  id: string;
  birthdate: string;
  imageURL?: string;
  displayName: string;
  created: string;
  lastActive: string;
  gender: 'male' | 'female' | 'other';
  description?: string;
  city: string;
  country: string;
}

export interface Photo {
  id: number;
  url: string;
  publicId?: string | null;
  memberId: string;
}

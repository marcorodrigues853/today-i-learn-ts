export interface Facts {
  id: number;
  created_at: Date;
  text: string;
  source: string;
  category: string;
  votesInteresting: number;
  votesMindBlowing: number;
  votesFalse: number;
}

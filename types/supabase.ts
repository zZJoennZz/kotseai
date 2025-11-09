export interface Database {
  public: {
    Tables: {
      checklists: {
        Row: {
          id: number;
          created_at: string;
          user_id: string;
          make: string;
          model: string;
          year: string;
          mileage: number;
          location: string;
          data: any;
        };
        Insert: {
          created_at?: string;
          user_id: string;
          make: string;
          model: string;
          year: string;
          mileage: number;
          location: string;
          data: any;
        };
      };
    };
  };
}

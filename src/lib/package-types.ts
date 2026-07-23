export interface Hotel {
  id: number;
  name: string;
  city: string;
  rating?: number;
  address?: string;
  distance?: string;
  image_url?: string;
  created_at?: string;
}

export interface UmrahPackage {
  id: number;
  title: string;
  airline: string;
  airline_logo?: string;
  departure_date: string;
  return_date?: string;
  days: number;
  price: number;
  hotel_makkah?: string;
  hotel_madina?: string;
  makkah_nights?: number;
  madina_nights?: number;
  from_city?: string;
  to_city?: string;
  seats?: number;
  makkah_hotel_distance?: string;
  madina_hotel_distance?: string;
  status?: string;
  image_url?: string;
  sharing_price?: number;
  double_price?: number;
  triple_price?: number;
  quad_price?: number;
  transport_included?: number;
  type?: string;
}

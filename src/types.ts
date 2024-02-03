/**
 * Country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1#Officially_assigned_code_elements) e.g. “SE”
 */
export type ISO_3166_1_A2 = string;

export type Config = {
  key: string;
  secret: string;
  test?: boolean;
};

export type Warehouse = {
  address: RegisteredAddress;
  defaultCollectionPoints: boolean;
  doorCode?: string;
  fossilFree?: boolean;
  id: number;
  name: string;
  outsideDoor: boolean;
  referencePerson: string;
  telephoneNumber: string;
};

export type RegisteredAddress = {
  city: string;
  country: string;
  id: number;
  postalCode: string;
  street: string;
};

export type BetweenDates = {
  from: Date;
  to: Date;
};

export type Interval = {
  collection: Window;
  delivery: Window;
  collectionPointIds?: string[];
  fossilFree?: boolean;
};

export type Window = {
  start: number;
  stop: number;
};

export type BaseOrder = {
  createdAt: number; // TODO to date
  updatedAt: number; // TODO to date
  id: string;
  token: string;
};

export type Order = BaseOrder & {
  interval: Interval;
  cart: Cart;
  collection: Warehouse;
  delivery: Delivery;
  signatureRequired: boolean;
  parcels: Parcel[];
  additionalServices: AdditionalServices;
  homeDelivery: boolean;
  productCodes: string[];
};

export type OrderPayload = {
  collectionId: number;
  cart: Cart;
  delivery: Delivery;
  requireSignature: boolean;
  productCodes?: string[];
  additionalServices?: AdditionalServices;
};

export type Cart = {
  cartId: string;
  articles?: Product[];
};

export type Product = {
  name: string;
  reference: string;
  quantity: number;
  unitPrice: number;
  currency: string; // ISO4217 currency
  taxRate?: number;
  discountRate?: number;
};

export type Consumer = {
  name: string;
  referencePerson?: string;
  telephoneNumber: string;
  email: string;
  address: Address;
  doorCode?: string;
  additionalInfo?: string;
};

export type Delivery = Consumer & {
  socialSecurityNumber?: string;
  outsideDoor?: boolean;
  additionalInfo?: string;
};

export type Address = {
  street: string;
  street2?: string;
  postalCode: string;
  city: string;
  country: string; // Country code ISO 3166-1 alpha-2 e.g. “SE”
};

export type AdditionalServices = {
  identificationCheckRequired?: boolean;
  recipientMinimumAge?: number;
  recipientMustMatchEndCustomer?: boolean;
  numberOfMissRetries?: number;
  singleIndoor?: boolean;
  doubleIndoor?: boolean;
  installation?: number;
  returnOfPackaging?: number;
  recycling?: number;
  swap?: number;
  fraudDetection?: boolean;
};

export type Partcel = {
  shipmentId?: string;
  packageId?: string;
  dimensions?: Dimensions;
};

export type Dimensions = {
  width?: number; // cm
  height?: number; // cm
  length?: number; // cm
  weight?: number; // grams
  volume?: number; // cm3
};

export type Parcel = {
  id: number;
  shipmentId: string;
  packageId: string;
  label: string;
};

export type ParcelPayload = {
  shipmentId?: string;
  packageId?: string;
  dimensions?: Dimensions;
};

export type TrackingLink = {
  url: string;
};

export type PickupPayload = {
  cartId: string;
  warehouseId: number;
  consumer: Consumer;
  numberOfParcels: number;
};

export type Pickup = BaseOrder & {
  interval: Window;
  returnWarehouse: Warehouse;
  consumer: Delivery;
  parcels: Omit<Parcel, "id">[];
  additionalServices: AdditionalServices;
  productCodes: string[];
};

export type LockersQuery = {
  collectionPointId: number;
  language: string;
  width: number;
  height: number;
  length: number;
  readyToShip: Date; // ISO8601
};

export type Locker = {
  id: string;
  address: LockerAddress;
  estimatedDelivery: string; // TODO to date
  cutoff: string; // TODO to date
  distance: number;
  name: string;
  directions: string;
  label: string;
  openingHours: OpeningHours;
};

export type LockerAddress = Address & {
  coordinate: Coordinate;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type OpeningHours = {
  periods: OpeningHourPeriod[];
  weekdayText: string[];
};

export type OpeningHourPeriod = {
  open: DayTime;
  close: DayTime;
};

type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type DayTime = {
  day: DayOfWeek;
  time: string;
};

export type DropOff = Pickup & {
  lockerId?: string;
};

export type DropOffPayload = {
  cartId: string;
  warehouseId: number;
  consumer: DropOffConsumer;
  lockerId?: string;
  dimensions?: Dimensions;
};

export type DropOffConsumer = {
  name: string;
  phoneNumber: string;
  email: string;
  address: Omit<Address, "street2">;
};

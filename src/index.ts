import RESTClient from "@/rest";
import type {
  BetweenDates,
  Delivery,
  DropOff,
  DropOffPayload,
  ISO_3166_1_A2,
  Interval,
  Locker,
  Order,
  OrderPayload,
  Parcel,
  ParcelPayload,
  Pickup,
  PickupPayload,
  TrackingLink,
  Warehouse,
} from "@/types";

const dateFmt = new Intl.DateTimeFormat("sv-SE");

export default class Client extends RESTClient {
  /**
   * List merchant's registered warehouses.
   * @returns {Warehouse[]}
   */
  warehouses(): Promise<Warehouse[]> {
    return this.get({
      path: "users/collection-points",
      headers: {
        "Content-Type": "application/vnd.budbee.users-v1+json",
      },
    }).then(res => res.json() as Promise<Warehouse[]>);
  }

  /**
   * Retrieve closest warehouse in region 
   * @param {string | number} postalCode
   * @param {ISO_3166_1_A2} countryCode Recipient Country code.
   * @returns {Warehouse}
   */
  warehouseInRegion(
    postalCode: string | number,
    countryCode: string = "SE",
  ): Promise<Warehouse> {
    return this.get({
      path: `postalcodes/validate/${countryCode}/${postalCode}`,
      headers: {
        "Content-Type": "application/vnd.budbee.postalcodes-v2+json",
      },
    }).then(res => res.json() as Promise<Warehouse>);
  }

  /**
   * List all postal codes in country.
   * @param {ISO_3166_1_A2} countryCode 
   * @returns {string[]}
   */
  postalCodes(countryCode: ISO_3166_1_A2 = "SE"): Promise<string[]> {
    return this.get({
      path: `postalcodes/${countryCode}`,
      headers: {
        "Content-Type": "application/vnd.budbee.postalcodes-v1+json",
      },
    }).then(res => res.json() as Promise<string[]>);
  }

  /**
   * List upcoming delivery windows for a specific postal code. In [Unix epoch time](https://en.wikipedia.org/wiki/Unix_time) in milliseconds, and the timezone returned is always in UTC (GMT+0).
   * @param {string | number} postalCode 
   * @param {number | BetweenDates} interval 
   * @param {ISO_3166_1_A2} countryCode 
   * @returns {Interval[]}
   */
  deliveryWindows(
    postalCode: string | number,
    interval: number | BetweenDates,
    countryCode: ISO_3166_1_A2 = "SE",
  ): Promise<Interval[]> {
    return this.get({
      path: `intervals/${countryCode}/${postalCode}/` + (
        typeof interval === "number" ? interval : [
          dateFmt.format(interval.from),
          dateFmt.format(interval.to),
        ].join("/")
      ),
      headers: {
        "Content-Type": "application/vnd.budbee.intervals-v2+json",
      },
    }).then(res => res.json() as Promise<Interval[]>);
  }

  /**
   * Retrieve a specific order. 
   * @param {string} orderId 
   * @returns {Order}
   */
  order(orderId: string): Promise<Order> {
    return this.get({
      path: `multiple/orders/${orderId}`,
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v1+json",
      },
    }).then(res => res.json() as Promise<Order>);
  }

  /**
   * note: you must validate {@link Client.warehouseInRegion} the delivery postalcode before you attempt to create an order. 
   * @param {Order} order 
   * @returns {Order}
   */
  createOrder(order: OrderPayload): Promise<Order> {
    return this.post({
      path: "multiple/orders",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v2+json",
      },
    }).then(res => res.json() as Promise<Order>);
  }

  // TODO
  // Set the delivery date of an Order by supplying a valid value generated by .deliveryWindows()
  // The input will be validated, and rejected if not valid / has expired.
  // https://developer.budbee.com/#Set-delivery-date
  // setDeliveryDate(orderId: string) {
  // }

  /**
   * This will update the information about the customer on an order.
   * @param {string} orderId 
   * @param {Omit<Partial<Delivery, "address">>} info 
   * @returns {Order} The updated order.
   */
  updateDeliveryConsumerInfo(
    orderId: string,
    info: Omit<Partial<Delivery>, "address">,
  ): Promise<Order> {
    return this.put({
      path: `multiple/orders/${orderId}`,
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v1+json",
      },
    }).then(res => res.json() as Promise<Order>);
  }

  /**
   * Cancel an active order.
   * @param {string} orderId 
   */
  cancelOrder(orderId: string) {
    return this.delete({
      path: `multiple/orders/${orderId}`,
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v1+json",
      },
    });
  }

  /**
   * Add parcels to a order.
   * @param {string} orderId 
   * @param {ParcelPayload[]} parcels 
   * @returns {Parcel[]}
   */
  addParcels(orderId: string, parcels: ParcelPayload[]): Promise<Parcel[]> {
    return this.post({
      path: `multiple/orders/${orderId}/parcels`,
      body: JSON.stringify(parcels),
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v2+json",
      },
    }).then(res => res.json() as Promise<Parcel[]>);
  }

  /**
   * Remove parcel from order. This can only be done before carrier has picked it up.
   * @param {string} orderId
   * @param {string} parcelId 
   */
  removeParcel(orderId: string, parcelId: number) {
    return this.delete({
      path: `multiple/orders/${orderId}/parcels/${parcelId}`,
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v1+json",
      },
    });
  }

  /**
   * Retrieve a order tracking url.
   * @param {string} orderId 
   * @returns {string}
   */
  orderTracker(orderId: string): Promise<string> {
    return this.get({
      path: `multiple/orders/${orderId}/tracking-url`,
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v1+json",
      },
    })
      .then(res => res.json() as Promise<TrackingLink>)
      .then(res => res.url);
  }

  /**
   * Rertive a parcel tracking url.
   * @param {string} parcelId 
   * @returns {string}
   */
  parcelTracker(parcelId: string): Promise<string> {
    return this.get({
      path: `parcels/${parcelId}/tracking-url`,
      headers: {
        "Content-Type": "application/vnd.budbee.parcels-v1+json",
      },
    })
      .then(res => res.json() as Promise<TrackingLink>)
      .then(res => res.url);
  }

  /**
   * Book a standalone return pickup.
   * @param {PickupPayload} pickup
   * @returns {Pickup}
   */
  createPickup(pickup: PickupPayload): Promise<Pickup> {
    return this.post({
      path: "returns",
      body: JSON.stringify(pickup),
      headers: {
        "Content-Type": "application/vnd.budbee.returns-v1+json",
      },
    }).then(res => res.json() as Promise<Pickup>);
  }

  /**
   * Book a standalone box return drop-off.
   * @param {DropOff} dropOff
   * @returns {DropOff}
   */
  createDropOff(dropOff: DropOffPayload): Promise<DropOff> {
    return this.post({
      path: "box/return",
      body: JSON.stringify(dropOff),
      headers: {
        "Content-Type": "application/vnd.budbee.standalone-box-returns-v1+json",
      },
    }).then(res => res.json() as Promise<DropOff>);
  }

  /**
   * Retrive a locker.
   * @param {string} lockerId
   * @returns {Locker}
   */
  locker(lockerId: string): Promise<Locker> {
    // TODO query param language
    return this.get({
      path: `boxes/${lockerId}`,
      headers: {
        "Content-Type": "application/vnd.budbee.boxes-v1+json",
      },
    }).then(res => res.json() as Promise<Locker>);
  }

  /**
   * List all lockers in the country.
   * @param countryCode
   * @returns 
   */
  lockers(
    countryCode: string = "SE",
  ): Promise<Locker[]> {
    // TODO query param language
    return this.get({
      path: `boxes/all/${countryCode}`,
      headers: {
        "Content-Type": "application/vnd.budbee.boxes-v1+json",
      },
    })
      .then(res => res.json() as Promise<{lockers: Locker[]}>)
      .then(res => res.lockers);
  }

  /**
   * Get available Lockers to display in checkout, the results are sorted in best to worst option for the recipient based on the requested postal code.
   * @param {string} postalCode
   * @param {string} countryCode 
   * @returns {Promise<Locker[]>}
   */
  lockersInRegion(
    postalCode: string,
    countryCode: string = "SE",
  ): Promise<Locker[]> {
    // TODO LockersQuery 
    return this.get({
      path: `boxes/postalcodes/validate/${countryCode}/${postalCode}`,
      headers: {
        "Content-Type": "application/vnd.budbee.boxes-v1+json",
      },
    })
      .then(res => res.json() as Promise<{lockers: Locker[]}>)
      .then(res => res.lockers);
  }

  /**
   * note: you must validate {@link Client.lockersInRegion} the delivery postalcode before you attempt to create an order
   * @param {string} lockerId 
   * @param {OrderPayload} delivery 
   * @returns {Order}
   */
  createBoxOrder(
    lockerId: string | undefined | null,
    delivery: OrderPayload,
  ): Promise<Order> {
    return this.post({
      path: "multiple/orders",
      body: JSON.stringify({
        ...delivery,
        productCodes: ["DLVBOX"],
        boxDelivery: {selectedBox: lockerId},
      }),
      headers: {
        "Content-Type": "application/vnd.budbee.multiple.orders-v2+json",
      },
    }).then(res => res.json() as Promise<Order>);
  }
}
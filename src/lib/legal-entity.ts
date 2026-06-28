// Legal entity behind the DolaPay product/brand.
export const LEGAL_ENTITY = {
  name: "Dolapo ECOM LLC",
  brand: "DolaPay",
  address: {
    street: "1209 Mountain Road Pl NE",
    city: "Albuquerque",
    state: "New Mexico",
    country: "USA",
  },
} as const;

export const LEGAL_ENTITY_ADDRESS_LINE =
  `${LEGAL_ENTITY.address.street}, ${LEGAL_ENTITY.address.city}, ${LEGAL_ENTITY.address.state}, ${LEGAL_ENTITY.address.country}`;

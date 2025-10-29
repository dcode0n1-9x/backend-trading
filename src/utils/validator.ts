import { Segment } from "@prisma/client";
import { Elysia, t } from "elysia";



// Signup Layers
const sendOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15 }),
});
const verifyOTPLayer = t.Object({
  phone: t.String({ minLength: 10, maxLength: 15 }),
  otp: t.String({ minLength: 6, maxLength: 6 }),
});

const signUpPanLayer2 = t.Object({
  panNumber: t.String({ minLength: 10, maxLength: 10 }),
  segment: t.Enum(Segment),
  aadhaarNumber: t.String({ minLength: 12, maxLength: 12 }),
});
const signUpAddressLayer3 = t.Object({
  fatherName: t.String(),
  motherName: t.String(),
  maritalStatus: t.String(),
  annualIncome: t.String(),
  tradingExperience: t.String(),
  occupation: t.String(),
});

// Login Body
const loginBody = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

const createEventTypeBody = t.Object({
  title: t.String(),
  duration: t.Number(),
  userId: t.String(),
});

const updateEventTypeBody = t.Object({
  title: t.String(),
  duration: t.Number(),
});

const createBookingBody = t.Object({
  eventTypeId: t.String(),
  hostId: t.String(),
  guestId: t.Optional(t.String()),
  guestEmail: t.String({format: 'email'}),
  startTime: t.String(),
  endTime: t.String()
})

const updateBookingBody = t.Object({
  startTime: t.String(),
  endTime: t.String()
})

const createAvailabilityBody = t.Object({
  days: t.Array(t.Number()),
  startTime: t.String(),
  endTime: t.String(),
  userId: t.String(),
  name: t.Optional(t.String()),
  eventTypeId: t.Optional(t.String())
})

const updateAvailabilityBody = t.Object({
  days: t.Array(t.Number()),
  startTime: t.String(),
  endTime: t.String()
})



export const signUpBody = new Elysia().model({
  "auth.signup.sendotp": sendOTPLayer,
  "auth.signup.verifyotp": verifyOTPLayer,
  "auth.signup.layer2": signUpPanLayer2,
  "auth.signup.layer3": signUpAddressLayer3,
});


export const authModel = new Elysia().model({
  "auth.login": loginBody,
});

export const eventModel = new Elysia().model({
  "event.create": createEventTypeBody,
  "event.update": updateEventTypeBody,
});

export const bookingModel = new Elysia().model({
  'booking.create': createBookingBody,
  'booking.update': updateBookingBody
})

export const availabilityModel = new Elysia().model({
  'availability.create': createAvailabilityBody,
  'availability.update': updateAvailabilityBody
})
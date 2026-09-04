import type { InboundPayload } from "@/lib/sprinklr/types";

export const DEMO_SAMPLES: InboundPayload[] = [
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_late_4412",
      text: "My package is 4 days late. Order #4412. Tracking hasn't moved at all. #shipping",
      channel: "Twitter",
      account: "AcmeCare",
      author: "@frustrated_pat",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_charge_twice",
      text: "Charged twice for the same order?? Invoice 8831 still shows two captures.",
      channel: "Email",
      account: "AcmeCare",
      author: "morgan@example.com",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_returns_blade",
      text: "Returning the blender — blade arrived chipped. Need a prepaid label. #returns",
      channel: "Facebook",
      account: "HarborOfficial",
      author: "Jamie L.",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_UPDATED",
    payload: {
      id: "msg_advocacy_kettle",
      text: "Just got the Harbor & Co kettle — obsessed. Thank you @HarborOfficial #unboxing #SpringLaunch",
      channel: "Instagram",
      account: "HarborOfficial",
      author: "@homewithria",
      entityType: "AdvocacyPost",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_nps_replace",
      text: "Thanks @AcmeCare for replacing so fast. Survey done. #NPS",
      channel: "Twitter",
      account: "AcmeCare",
      author: "@sam_ok",
      entityType: "AdvocacyPost",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_delayed_truck",
      text: "Driver says the shipment is delayed again. Still no new tracking scan.",
      channel: "WhatsApp",
      account: "AcmeCare",
      author: "+1 415-555-0198",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_holiday_gift",
      text: "Can this arrive before the holiday? It's a gift and the page is not clear.",
      channel: "Email",
      account: "NorthwindHome",
      author: "priya@example.com",
      entityType: "Message",
    },
  },
  {
    type: "CASE_CREATED",
    payload: {
      id: "case_dishwasher",
      text: "Is this dishwasher safe? The listing is confusing and the box says something else.",
      channel: "Sprinklr Care",
      account: "NorthwindHome",
      author: "Case #2044",
      entityType: "Case",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_unexpected",
      text: "This is not what I expected at all.",
      channel: "Twitter",
      account: "AcmeCare",
      author: "@quietbuyer",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_color_off",
      text: "The finish looks different from the photos. Not sure if I keep it.",
      channel: "Email",
      account: "HarborOfficial",
      author: "lee@example.com",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_help_please",
      text: "Hi — can someone help me with this?",
      channel: "Facebook",
      account: "AcmeCare",
      author: "Chris P.",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_sale_question",
      text: "Is this on sale or did the price just change on me?",
      channel: "Twitter",
      account: "NorthwindHome",
      author: "@dealhunter",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_box_dented",
      text: "Box was dented. Product seems fine. Do I still open a return?",
      channel: "Instagram",
      account: "HarborOfficial",
      author: "@apt3b",
      entityType: "Message",
    },
  },
  {
    type: "CASE_CREATED",
    payload: {
      id: "case_warranty",
      text: "Does the warranty cover a scuffed lid after two weeks?",
      channel: "Sprinklr Care",
      account: "NorthwindHome",
      author: "Case #2091",
      entityType: "Case",
    },
  },
  {
    type: "MESSAGE_RECEIVED",
    payload: {
      id: "msg_wrong_item",
      text: "Opened the box and it is a different model than I ordered.",
      channel: "Email",
      account: "AcmeCare",
      author: "devon@example.com",
      entityType: "Message",
    },
  },
  {
    type: "MESSAGE_UPDATED",
    payload: {
      id: "msg_maybe_keep",
      text: "Hmm. Maybe I keep it. Still thinking.",
      channel: "Twitter",
      account: "HarborOfficial",
      author: "@undecided",
      entityType: "Message",
    },
  },
];

export function sampleById(id: string) {
  return DEMO_SAMPLES.find((s) => s.payload.id === id);
}

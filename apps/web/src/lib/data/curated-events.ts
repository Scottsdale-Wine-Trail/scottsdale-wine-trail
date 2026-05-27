export type CuratedEvent = {
  id: string;
  title: string;
  venue: string;
  schedule: string;
  type: string;
  body: string[];
  cta?: { label: string; href: string };
  contact?: string;
  image?: string;
};

export const CURATED_EVENTS: CuratedEvent[] = [
  {
    id: "meet-the-maker-dos-cabezas",
    title: "Meet the Maker: Dos Cabezas",
    venue: "The Wine Collective of Scottsdale",
    schedule: "Thursday, May 28th · 5:30 PM",
    type: "Tasting",
    body: [
      "Join us for a special evening at The Wine Collective of Scottsdale as we welcome winemaker Todd Bostock of Dos Cabezas Wineworks. This intimate event offers a unique opportunity to meet the maker, hear the story behind the wines, and enjoy a curated tasting of four exceptional pours from Dos Cabezas.",
      "Todd's passion for small-lot, sustainably sourced Arizona wines shines through in every bottle. Whether you're a longtime fan or new to the wines, this is the perfect chance to sip, learn, and connect in a relaxed setting.",
      "Limited seating available. Reserve your spot today. We are not able to refund tickets for this event.",
    ],
    cta: {
      label: "Purchase Tickets",
      href: "https://www.the-wine-collective.com/product/meet-the-maker-dos-cabezas/1117",
    },
    image: "/images/events/meet-the-maker-dos-cabezas.jpg",
  },
  {
    id: "summer-wine-series-book-club",
    title: "Summer Wine Series Book Club",
    venue: "The Wine Collective of Scottsdale",
    schedule: "May 20th · 6:00 PM",
    type: "Book Club",
    body: [
      "Featured Book: Cork Dork by Bianca Bosker.",
      "Join us for our inaugural book club as we dive into the world of wine with a glass in hand.",
      "Book Club Special: Petite Cheese & Meat Board + Happy Hour Wine for $25.",
    ],
    cta: {
      label: "RSVP on Meetup",
      href: "https://www.meetup.com/wine-book-club-old-town/events/hnwcxtyjchbbc/?eventOrigin=group_events_list",
    },
    image: "/images/events/summer-wine-series-book-club.jpg",
  },
  {
    id: "cook-like-a-dame",
    title: "Cook Like a Dame",
    venue: "Via Zoom",
    schedule: "Tuesday, May 12 · 6:30–8:00 PM MST",
    type: "Class",
    body: [
      "Peggy Fiandaca, LDV Winery Owner/Co-Winemaker and President of the Arizona Chapter of Les Dames d'Escoffier, will lead an interactive cooking-with-wine and food pairing class.",
      "Cost: $50. All proceeds support scholarships and grants for women in food, beverage, and hospitality.",
    ],
    cta: {
      label: "Register",
      href: "https://ldeiphoenix.com/cook-like-a-dame/",
    },
    image: "/images/events/cook-like-a-dame.jpg",
  },
  {
    id: "winemaker-talk-ldv",
    title: "Winemaker Talk",
    venue: "LDV Winery",
    schedule: "Saturday, May 23 · 10:30 AM–Noon",
    type: "Educational",
    body: [
      "Join Curt Dunham for a Winemaker Talk focused on Taste of Library Wines.",
      "Complimentary for wine club members. Guests: $20 plus tax & gratuity.",
      "Includes wine, nibbles, and discussion.",
    ],
    contact: "Call 480-664-4822 to register.",
    image: "/images/events/winemaker-talk-ldv.jpg",
  },
  {
    id: "bottomless-mimosas-aridus",
    title: "Bottomless Mimosas",
    venue: "Aridus Wine Co.",
    schedule: "Every Sunday · 12:00–4:30 PM",
    type: "Recurring",
    body: [
      "Settle in at Aridus Wine Co. for bottomless mimosas every Sunday afternoon. A relaxed Old Town tradition perfect for brunch crowds, birthdays, and lazy weekends.",
    ],
    image: "/images/events/bottomless-mimosas-aridus.jpg",
  },
  {
    id: "aridus-after-hours",
    title: "Aridus After Hours",
    venue: "Aridus Wine Co.",
    schedule: "Every Friday · 8:00–11:00 PM",
    type: "Recurring",
    body: [
      "Pizza, wine, DJ, and games every Friday night at Aridus Wine Co.",
      "Reverse happy hour with extra discounts for members and industry. $5 cover, waived for wine club members and industry.",
    ],
    image: "/images/events/aridus-after-hours.jpg",
  },
];

export const TYPE_COLORS: Record<string, string> = {
  Tasting: "bg-burgundy-50 text-burgundy-700 border-burgundy-200",
  "Book Club": "bg-amber-50 text-amber-700 border-amber-200",
  Class: "bg-blue-50 text-blue-700 border-blue-200",
  Educational: "bg-blue-50 text-blue-700 border-blue-200",
  Recurring: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

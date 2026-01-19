/**
 * Seed script for Poll Axes
 * Run with: npx tsx src/scripts/seed-poll-axes.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const pollAxesData = [
  {
    name: 'Belonging vs Independence',
    badges: {
      yesSoft: {
        title: 'The Quiet Companion',
        subtext: 'You build life through closeness and shared presence.',
      },
      yesStrong: {
        title: 'Emotionally Anchored',
        subtext: 'You believe connection is the foundation of meaning.',
      },
      noSoft: {
        title: 'Self-Sustaining',
        subtext: "You value closeness, but not at the cost of yourself.",
      },
      noStrong: {
        title: 'Emotionally Sovereign',
        subtext: 'You refuse to lose identity to belonging.',
      },
    },
  },
  {
    name: 'Loyalty vs Freedom',
    badges: {
      yesSoft: {
        title: 'The Steady One',
        subtext: 'You stay even when it would be easier to leave.',
      },
      yesStrong: {
        title: 'Unbreakably Loyal',
        subtext: 'Commitment is a principle, not a feeling.',
      },
      noSoft: {
        title: 'The Independent Spirit',
        subtext: "You love deeply, but you don't disappear.",
      },
      noStrong: {
        title: 'Freedom-First',
        subtext: 'You protect autonomy over obligation.',
      },
    },
  },
  {
    name: 'Duty vs Desire',
    badges: {
      yesSoft: {
        title: 'The Responsible Heart',
        subtext: 'You prioritize stability and responsibility.',
      },
      yesStrong: {
        title: 'Duty-Bound',
        subtext: 'You carry obligation even when it costs you.',
      },
      noSoft: {
        title: 'Desire-Led',
        subtext: 'You listen to what you want without guilt.',
      },
      noStrong: {
        title: 'Unapologetic',
        subtext: 'You refuse to sacrifice desire for expectation.',
      },
    },
  },
  {
    name: 'Safety vs Truth',
    badges: {
      yesSoft: {
        title: 'The Protector',
        subtext: 'You value peace and emotional safety.',
      },
      yesStrong: {
        title: 'Safety-Driven',
        subtext: 'Stability matters more than confrontation.',
      },
      noSoft: {
        title: 'Truth-Seeker',
        subtext: "You prefer honesty, even when it's uncomfortable.",
      },
      noStrong: {
        title: 'Radically Honest',
        subtext: 'You choose truth, regardless of the fallout.',
      },
    },
  },
]

async function seedPollAxes() {
  const payload = await getPayload({ config })

  console.log('Seeding poll axes...')

  for (const axisData of pollAxesData) {
    // Check if axis already exists
    const existing = await payload.find({
      collection: 'poll-axes',
      where: {
        name: { equals: axisData.name },
      },
    })

    if (existing.docs.length > 0) {
      console.log(`Axis "${axisData.name}" already exists, skipping...`)
      continue
    }

    await payload.create({
      collection: 'poll-axes',
      data: axisData,
    })

    console.log(`Created axis: ${axisData.name}`)
  }

  console.log('Poll axes seeding complete!')
  process.exit(0)
}

seedPollAxes().catch((error) => {
  console.error('Error seeding poll axes:', error)
  process.exit(1)
})

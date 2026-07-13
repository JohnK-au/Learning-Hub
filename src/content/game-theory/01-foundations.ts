import { defineModule } from "@/schema/define.ts";

export default defineModule({
  id: "gt-foundations",
  title: "First principles",
  summary:
    "What a 'game' is, and the equilibrium that makes everyone worse off.",
  lessons: [
    {
      id: "gt-what-is-a-game",
      title: "What game theory actually studies",
      estimatedMinutes: 3,
      blocks: [
        {
          kind: "prose",
          body: "Game theory isn't about games. It's the study of decisions where **your best move depends on what someone else does — and theirs depends on you.** Chess qualifies. So do salary negotiations, arms races, and deciding whether to merge into traffic. Anywhere outcomes are *interdependent*, the tools apply.",
        },
        {
          kind: "prose",
          body: "A **game** needs only three ingredients: players, the strategies available to each, and the payoffs each combination produces. Strip a messy human situation down to those three, and you can often see the outcome before it happens.",
        },
        {
          kind: "callout",
          variant: "tip",
          body: "The discipline's power is also its trap: it assumes players are rational and know the payoffs. Real people are neither — which is precisely where behavioural economics picks up the thread.",
        },
        {
          kind: "activity",
          activity: {
            type: "multiple-choice",
            prompt: "Which situation is NOT a game in the technical sense?",
            choices: [
              "Two firms deciding whether to cut prices",
              "Choosing what to eat alone at home",
              "Two countries deciding whether to arm",
            ],
            answerIndex: 1,
            explanation:
              "No interdependence — nobody else's choice changes your best move. No other player, no game.",
          },
        },
      ],
      reviewItems: [
        {
          question: "What three ingredients define a game?",
          answer: "Players, their available strategies, and the payoffs.",
        },
      ],
    },
    {
      id: "gt-nash-equilibrium",
      title: "Nash equilibrium, and why it isn't 'the best outcome'",
      estimatedMinutes: 4,
      blocks: [
        {
          kind: "prose",
          body: "A **Nash equilibrium** is a set of choices where *no player can do better by changing their move alone*. It's a stalemate of self-interest: everyone is doing the best they can, given what everyone else is doing. Crucially, that is **not** the same as everyone doing well.",
        },
        {
          kind: "figure",
          src: "/figures/payoff-matrix.svg",
          alt: "A prisoner's dilemma payoff matrix. Both confessing (8, 8) is the Nash equilibrium, though both staying silent (1, 1) would be better for both.",
          caption:
            "Both confess — each acting rationally — and both land in a cell that's worse for them than mutual silence.",
        },
        {
          kind: "prose",
          body: "Walk it through: whatever *they* do, confessing is better for **you** (0 beats 1 if they stay silent; 8 beats 10 if they confess). The logic is airtight, symmetric, and lands you both in eight years, when silence would have cost one. Rationality, faithfully applied by both parties, produces a collectively terrible result. That's not a paradox — it's the point.",
        },
        {
          kind: "callout",
          variant: "insight",
          body: "This is the shape of climate negotiation, arms races, overfishing, and doping in sport. The equilibrium is stable *and* bad — which is why these problems need enforceable agreements, not better intentions.",
        },
        {
          kind: "activity",
          activity: {
            type: "recall",
            prompt:
              "From memory: define a Nash equilibrium — and say why it needn't be the best outcome.",
            answer:
              "A set of strategies where no player can improve by unilaterally changing theirs. It's stable, not optimal: the prisoner's dilemma settles in an equilibrium that's worse for both than cooperating.",
            hint: "Emphasis on the word 'unilaterally'.",
          },
        },
      ],
      reviewItems: [
        {
          question: "Why isn't a Nash equilibrium necessarily a good outcome?",
          answer:
            "It only means nobody can improve by moving alone — mutual defection in the prisoner's dilemma is an equilibrium yet worse for both than cooperating.",
        },
      ],
    },
  ],
});

import { db } from "@workspace/db";
import {
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
  seedMetaTable,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "./logger";

// Content version of the seeded curriculum. BUMP THIS whenever the TOPICS or
// ASSIGNMENTS content below changes. On boot, seedIfEmpty compares this against
// the value stored in seed_meta; a mismatch forces a full re-seed, so content
// edits self-heal in every environment (including a republished production)
// without a manual database wipe.
const SEED_CONTENT_VERSION = "2026-06-10-realworld-cases-v2";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Foundations of Value
  {
    slug: "what-is-ethics",
    title: "What is ethics?",
    weekNumber: 1,
    blurb: "Normative vs. descriptive statements; what ethics studies.",
    lectureTitle: "1.1 What is ethics? Normative vs. descriptive",
    body: `# What is ethics?

There are two kinds of statements: **descriptive** and **normative**.

A *descriptive* statement says that such and such is the case. It carries no value-judgment. "Smith is over six feet tall" and "grass is green" are descriptive — they simply report facts.

A *normative* statement expresses a **value-judgment**. It says that something falls short of, satisfies, or exceeds some standard or norm. "It was evil of Hitler to commit genocide," "it is wrong to steal," "it is commendable to give to charity," and "Smith acted valiantly in saving the drowning toddler" are all normative.

## What ethics is

Ethics is the discipline that tries to **clarify the structure of normative concepts** — to state as clearly as possible the conditions a thing must satisfy in order to fall under them. What exactly must an act satisfy to be praiseworthy? What must an institution satisfy to be just?

So ethics is not, at bottom, a list of rules. It is an attempt to make explicit what we *mean* when we judge an act good or bad, right or wrong, just or unjust.

## Why the distinction matters

Much confusion in moral argument comes from sliding between description and evaluation — treating "people do X" as if it settled "people ought to do X." Keeping the two kinds of statements apart is the first discipline of clear ethical thinking.

## In the real world

In *Buck v. Bell* (1927), the U.S. Supreme Court upheld the forced sterilization of Carrie Buck, with Justice Oliver Wendell Holmes writing "three generations of imbeciles are enough." The reasoning slid straight from contested *descriptive* claims about heredity to a *normative* conclusion about who ought to be sterilized — exactly the confusion this section warns against. Roughly 70,000 Americans were sterilized under such laws.`,
  },
  {
    slug: "normative-categories",
    title: "Normative categories",
    weekNumber: 1,
    blurb: "Concepts that occur only in value-judgments.",
    lectureTitle: "1.2 Normative categories",
    body: `# Normative categories

A **normative category** is a concept that occurs *only* in normative judgments — never in purely factual ones.

Examples include: *good, bad, just, unjust, valiant, noble, wicked, depraved, commendable,* and *condemnable*. You cannot use any of these to merely describe the world; to apply them is already to evaluate.

## Contrast with descriptive categories

"Tall," "green," "heavy," and "six feet" are descriptive categories — applying them takes a measurement, not a value-judgment. "Noble" and "depraved" are different in kind: they place an act or person on a scale of worth.

## Ethics as the study of these concepts

Ethics tries to map the **internal structure** of normative categories. When we call an act *condemnable*, what conditions are we claiming it meets? When we call a person *noble*, what are we attributing to them?

A key lesson of this course is that these concepts are subtler than they first appear. "Good" turns out to mean several different things; "right" is not the same as "good"; and "condemnable" is not simply the absence of "commendable." Sorting these categories out carefully is most of the work of ethics.

## In the real world

When Raoul Wallenberg used forged Swedish protective passports to shelter tens of thousands of Hungarian Jews from deportation in 1944, the world reached for words like *noble*, *heroic*, and *courageous*. None of those terms merely describe what he did — each one *evaluates* it. That is what makes them normative categories: you cannot apply them without already passing judgment.`,
  },
  {
    slug: "instrumental-intrinsic",
    title: "Instrumental vs. intrinsic goodness",
    weekNumber: 1,
    blurb: "Useful-as-a-means vs. good-in-itself; what ethics cares about.",
    lectureTitle: "1.3 Instrumental vs. intrinsic goodness",
    body: `# Two kinds of goodness

The words "good" and "bad" are **ambiguous** — each has more than one meaning, and each has both normative and non-normative uses. Start with "good."

## Instrumental goodness

To say an act is **instrumentally good** is to say it has consequences desired by, or to the advantage of, the agent (the person who acts). If my sole aim is money, then stealing a million dollars from an orphanage — assuming I get away with it — is instrumentally good *for me*. It is *useful*: it serves my practical interest.

But stealing from a charity is obviously not **ethically** good. It is good only in a practical, strategic sense.

## Intrinsic goodness

If something is good in a **non-instrumental** sense — good even when its consequences are set aside — it is **intrinsically good**. Ethics is concerned with intrinsic goodness. It asks: *which things are good in themselves?*

Ethics has no interest in helping thieves steal more efficiently or politicians grab more power. It seeks the courses of action and states of affairs that are good *even if their consequences are disregarded*.

## A tentative list

No two ethicists fully agree, but many count among the intrinsic goods: happiness, intelligence, benevolence, honesty, loyalty, pleasure, life, friendship, compassion, and freedom (freedom from physical coercion, emotional freedom, and intellectual freedom). Helping someone in need at no advantage to oneself is intrinsically good; so is being honest when lying would be easier.

## Not mutually exclusive

The two kinds overlap. A sharp intellect is *instrumentally* good (it improves your position) **and** *intrinsically* good (its value exceeds any advantage it brings). The same holds for happiness, friendship, and honesty.

## In the real world

Hedge-fund manager Raj Rajaratnam made tens of millions of dollars in illegal profits by trading on inside information, until his 2011 conviction and 11-year prison sentence. The trades were *instrumentally* good for him — they served his bottom line beautifully. They were not in the slightest *ethically* good. That gap between "useful to the agent" and "good in itself" is the whole point of the distinction.`,
  },
  {
    slug: "goodness-commendableness",
    title: "Goodness and commendableness",
    weekNumber: 1,
    blurb: "Why some intrinsic goods deserve no praise.",
    lectureTitle: "1.4 Goodness vs. commendableness",
    body: `# Goodness vs. commendableness

"Intrinsic good" is *itself* ambiguous. Some intrinsically good things are **commendable** — they deserve praise. Some are not. (Ambiguities within ambiguities are common in philosophy.)

## Good but not praiseworthy

Happiness is intrinsically good. But does a happy person *deserve praise* for being happy? Not necessarily. If Smith is just naturally cheerful — if his good spirits cost him no effort and require no estimable act — then his happiness is genuinely good, yet he merits no praise for it.

The starkest case: a **rabbit's** happiness is a good thing. But given a rabbit's cognitive limits, it cannot act in a praiseworthy way. Its happiness is good without being commendable. ("Commendable" just means "praiseworthy.")

Likewise a naturally gifted pianist who never had to work for his talent: the talent and the joy it brings are intrinsically good, but he deserves no praise for a gift he did nothing to earn.

## Good *and* praiseworthy

Other intrinsic goods *are* commendable. Jones works long hours for a charity knowing he gains nothing practical by it. His behavior is both intrinsically good **and** commendable.

## The bottom line

There are **two kinds of intrinsic goods**: those that are commendable and those that are not. Praiseworthiness is not the same property as goodness — a lesson that becomes central when we turn to judging agents.

## In the real world

Mozart was composing and performing across Europe as a small child. The music and the joy it brought were genuinely, intrinsically good — yet the toddler deserved no *moral praise* for a raw gift he was simply born with. Praise became appropriate only later, for the discipline and labor he *chose* to add to the gift. Goodness and commendableness come apart.`,
  },
  {
    slug: "two-kinds-badness",
    title: "Two kinds of intrinsic badness",
    weekNumber: 1,
    blurb: "Why some intrinsic evils deserve no censure.",
    lectureTitle: "1.5 Two kinds of intrinsic badness",
    body: `# Two kinds of intrinsic badness

Goodness split into the commendable and the merely good. **Badness** splits the same way.

## Bad but not blameworthy

It is obviously bad to be unhappy, and the badness is **intrinsic** — being unhappy is bad in itself, even apart from any further misfortune it causes (a weakened immune system, alienated friends).

But one does not always *deserve censure* for being unhappy. Someone grieving the death of a loved one does not merit a reprimand for the grief. If anything, the person who felt *nothing* at such a loss would deserve censure — "only a monster would feel nothing."

So unhappiness is intrinsically bad without being **condemnable**.

## Bad *and* blameworthy

Other intrinsic evils clearly do warrant censure. Causing someone else to suffer for no good reason is intrinsically bad **and** condemnable.

## The bottom line

Some, but not all, intrinsically bad things are condemnable. "Intrinsically bad" is **not** identical with "worthy of condemnation" — just as "intrinsically good" is not identical with "worthy of praise." This symmetry between goodness/commendableness and badness/condemnableness is the backbone of how we will judge acts and agents.

## In the real world

The grief that swept the coastlines after the 2004 Indian Ocean tsunami was intrinsically bad — immense suffering — yet no one was to *blame* for it; it warranted compassion, not censure. Contrast the documented abuse of prisoners at Abu Ghraib that same year: that suffering was deliberately inflicted, which made it not merely bad but *condemnable*. Same category — intrinsic badness — but only one earns blame.`,
  },
  {
    slug: "morally-complex",
    title: "Morally complex situations",
    weekNumber: 1,
    blurb: "How one act can be good in one respect and bad in another.",
    lectureTitle: "1.6 The morally complex structure of situations",
    body: `# Morally complex situations

A single act or state of affairs can be **intrinsically good in one respect and intrinsically bad in another**.

## The piano example

Suppose I am playing the piano beautifully and taking real pleasure in it. That is an intrinsic good. But suppose my playing is waking my very sick roommate, who needs sleep, and I know it. Then my playing — though still an intrinsic good — is also **condemnable**. It is wrong, *and* it is intrinsically good at the same time.

This looks like a paradox but is not, because (as the next section shows) "wrong" is **not** the opposite of "good." Wrongness is not the absence of goodness, and "right" is not identical with "good."

## Commendable *and* condemnable

A single act can also be both praiseworthy and blameworthy. Jones, a tough and vindictive man, insults Smith; Green, Smith's friend, savagely beats Jones to avenge Smith's honor (out of pure loyalty, no self-interest). Green's act is **commendable** — it is loyal and courageous. It is also **condemnable** — it is excessive, unnecessary violence.

## The lesson

Most real situations are mixed. The temptation to label an act simply "good" or simply "bad" usually distorts it. Mature moral judgment means tracking several normative properties of the *same* act at once.

## In the real world

The atomic bombing of Hiroshima in August 1945 is debated precisely because it was morally *mixed*: defenders argue it shortened the war and so saved lives, while it also killed roughly 100,000 people, most of them civilians. One can hold that it was good in one respect and terrible in another without contradiction — which is exactly the structure this section describes.`,
  },
  {
    slug: "non-privative",
    title: "The non-privative character of moral attributes",
    weekNumber: 1,
    blurb: "Why good and bad can coexist: badness is a presence, not an absence.",
    lectureTitle: "1.7 The non-privative character of moral attributes",
    body: `# Why good and bad can coexist

There is nothing paradoxical about one act being both commendable and condemnable. The reason is logical: **neither property is the absence of the other**.

## Privative vs. positive properties

A **privative** property is one a thing has by *lacking* something. To be *cold* is to lack heat; to be *dumb* is to lack intelligence; to be *poor* is to lack money. To be sugar-free is to lack sugar.

A **positive** property is one a thing has by *having* something extra. To be *hot, smart, rich,* or *sugary* is not to lack anything — it is to possess something. (Here "positive" is a strictly logical term, with no moral connotation: being *poisonous* is a positive property in this sense.)

## Moral attributes are positive

Being **condemnable** is positive, not privative — it is the presence of something, not the absence of commendableness. Being **commendable** is also positive. So neither is identical with the absence of the other, which is exactly why both can be present in one act.

## Badness is a presence

People resist calling an act both good and bad partly because they wrongly think badness is the *absence* of goodness. It is not. A rock *lacks* goodness, yet a rock is not bad — it is neither good nor bad. To be bad you must have something **extra**: Hitler was bad not because he lacked something but because he *had* something rocks don't — ill will and a willingness to act on it.

The other reason people resist is psychological: it is easier to sort the world into saints and monsters than to see everyone, including oneself, as part-saint and part-monster. But that craving for simplicity does not match the real moral structure of most acts.

## In the real world

At the Wannsee Conference in January 1942, senior Nazi officials met to coordinate the logistics of the "Final Solution" — schedules, quotas, methods. What made it monstrous was not the *absence* of anything but the *presence* of something extra: organized, deliberate ill will. Evil is a positive property; a rock lacks goodness too, yet a rock is not evil.`,
  },

  // Unit 2 — Obligation, Right, and Wrong
  {
    slug: "weight-of-obligations",
    title: "The weight of moral obligations",
    weekNumber: 2,
    blurb: "Obligations come in degrees; so does wrongness.",
    lectureTitle: "2.1 Moral obligations have weight",
    body: `# Moral obligations have weight

Moral attributes are not binary, and neither are obligations. **Obligations come in degrees** — some are stronger than others.

## A scale of obligation

If I promise to meet you for lunch, I have an obligation to show up. But that obligation is weaker than my obligation to teach the classes a university pays me to teach. And *that* is weaker than a head of state's obligation to serve the interests of hundreds of millions of constituents.

## Degrees of wrongness

It follows that **wrongness comes in degrees** too. It is wrong to skip a lunch I promised to attend; *more* wrong to skip a class I am paid to teach; and *more* wrong still for a head of state to betray the trust of those they govern.

## Why this matters

A binary picture — "obligatory or not," "wrong or not" — cannot capture moral life. Real decisions are about *comparing weights*: which obligation is stronger, which wrong is graver. The next sections build directly on this idea, since conflicts between obligations of different weight are what force the hardest choices.

## In the real world

When the Watergate tapes confirmed that President Nixon had helped cover up the 1972 break-in, the gravity of the scandal — which forced his 1974 resignation — came from the *weight* of the obligation he breached. A private citizen who tells a similar lie wrongs someone; a president who betrays the trust of an entire nation commits a far weightier wrong. Same kind of act, vastly different weight.`,
  },
  {
    slug: "outweigh-vs-cancel",
    title: "Outweighing vs. canceling obligations",
    weekNumber: 2,
    blurb: "An outweighed obligation still exists.",
    lectureTitle: "2.2 Outweighing is not canceling",
    body: `# Outweighing is not canceling

We often face **conflicting obligations**. A central point: when one obligation outweighs another, it does **not** cancel it.

## The case

My best friend, who has always been kind to me, keeps a million dollars in a safe I can access. I have a clear obligation not to steal it — doing so would harm a decent person and betray his trust.

But I have five young children who will die without expensive medical treatment I cannot otherwise afford in time. The only way to save them is to take my friend's money. There is no third option.

## The stronger obligation

My obligation to save my children is **stronger** than my obligation not to steal. So the right thing — the *least bad* thing — is to take the money: the moral value of saving five lives exceeds the value of not stealing.

## But the weaker obligation remains

Crucially, that does **not** mean my obligation not to steal *ceases to exist*. In taking the money I still do something to my friend that he has a right not to undergo, and that I therefore had an obligation not to do. An obligation that is outweighed by a stronger one is **overridden, not erased**.

This is why doing "the right thing" in a dilemma can still leave a genuine moral residue — regret, a debt, something owed. The defeated obligation was real.

## In the real world

In *R v Dudley and Stephens* (1884), shipwrecked sailors killed and ate a severely weakened cabin boy to survive. Even granting that survival weighed heavily, the court still convicted them of murder — because the obligation not to kill an innocent was *overridden, not erased*. The conviction was the law's way of marking the residue: the defeated obligation was real.`,
  },
  {
    slug: "right-least-bad",
    title: '"Right" = least bad',
    weekNumber: 2,
    blurb: "Why the right act need not be a good one.",
    lectureTitle: '2.3 "Right" ≠ "good"; "right" = "least bad"',
    body: `# "Right" means "least bad"

It is easy to assume the **right** act is a *good* act. It is not.

## Back to the safe

Recall the dilemma: steal my friend's money or let my children die. The **right** thing is to steal the money — but stealing it is plainly the **lesser of two evils**. It is a bad thing, even a terrible thing; the alternative is simply worse.

So what makes the act *right* is **not** that it is a positive good. It is that it is the **least bad option the circumstances allow**.

## The general definition

In general, "the right course of action" means **the least bad course of action available** under the circumstances. Rightness is comparative: it is defined relative to the alternatives actually open to you, not against some abstract ideal of pure goodness.

## Why this matters

This dissolves the apparent paradox from Unit 1 — that an act can be wrong yet intrinsically good, or right yet bad. "Right" and "good" are simply different concepts. Recognizing that the right choice is often a bad one, chosen only because the others are worse, is essential to thinking honestly about dilemmas.

## In the real world

When an oxygen tank exploded aboard Apollo 13 in 1970, every option facing mission control was bad — there was no path that was simply *good*. They chose to loop the crew around the Moon and ration power to the edge of survival: not a good outcome, but the *least bad* one the circumstances allowed. That is exactly what "the right course of action" means here.`,
  },
  {
    slug: "wrong-least-good",
    title: '"Wrong" = least good',
    weekNumber: 2,
    blurb: "Why a wrong act can still be a good one.",
    lectureTitle: '2.4 "Wrong" ≠ "bad"; "wrong" = "least good"',
    body: `# "Wrong" means "least good"

Just as "right" is not "good," **"wrong" is not "bad."** A wrong act need not be a bad act. To be **wrong** is to be the **least good** of the available options.

## The rescue case

Suppose I can take exactly one of three actions:

- **(i)** save individuals M1–M10 (save 10, let 7 die),
- **(ii)** save M11–M15 (save 5, let 12 die),
- **(iii)** save M16–M17 (save 1... rather, save 2, let many more die).

Assume everyone is equally worthy of life.

If I choose to save the *smallest* group, I am still doing a **good** thing — saving lives is good. Yet I am doing the **wrong** thing, because it would clearly have been *better* to save the larger group. The more lives saved, the better.

## The lesson

So an act can be **good and wrong at once**: good because it has real positive value, wrong because some available alternative was better. "Wrong" marks not the presence of badness but the *failure to be the best available* — the least good of the live options.

Together with the previous section, this completes the decoupling of right/wrong from good/bad: all four are distinct, comparative notions.

## In the real world

This is the animating idea behind the effective-altruism movement and charity evaluators like GiveWell: a donation that helps *some* people is genuinely good, yet it can still be the *wrong* choice if the same money could have saved far more lives elsewhere. Doing good is not the same as doing the most good available — and falling short of the best available option is exactly what "wrong" marks here.`,
  },
  {
    slug: "ought-implies-can",
    title: '"Ought" implies "can"',
    weekNumber: 2,
    blurb: "Obligation requires ability — with a caveat.",
    lectureTitle: '2.5 "Ought" implies "can"',
    body: `# "Ought" implies "can"

A widely accepted principle: you have an obligation to do something **only if you can do it**. "Ought" implies "can."

## The basic idea

Because it is not in my power to heal every sick person on earth, I have no obligation to do so. I have an obligation to treat my students fairly only because doing so *is* within my power. Obligations track ability.

## The caveat

But the principle needs a grain of salt. We saw that one can have **multiple conflicting obligations** — an obligation to do X *and* Y *and* Z — even when it is impossible to do all three. In the safe case I ought to save my children *and* not steal, though I cannot do both. So, strictly, there are things one "ought" to do that one *cannot* do.

## The principle survives, refined

Still, the principle is not simply false. In such a conflict, there is **no single course of action** that I ought to carry out but cannot. It *is* within my power not to steal my friend's money (even if I cannot both refrain *and* save my children). And it seems that, if even that weren't within my power, I would have *no* obligation to refrain. So "ought" implies "can" holds for each obligation taken **singly**, even if the full set of obligations cannot be jointly satisfied.

## In the real world

When COVID-19 lockdowns in 2020 made it physically impossible to perform many signed contracts, courts and *force majeure* clauses widely excused the non-performance. The law echoes the principle "ought implies can": where compliance is genuinely impossible, the obligation to comply lapses. You cannot be bound to do what cannot be done.`,
  },
  {
    slug: "legality-morality",
    title: "Legality vs. morality",
    weekNumber: 2,
    blurb: "Legal and moral can come apart — and often overlap.",
    lectureTitle: "2.6 Legality is not morality",
    body: `# Legality is not morality

Legality and morality are **distinct**. They are not the same standard, and they can come apart.

## They can conflict

There are acts that are legal — even legally *required* — yet deeply immoral. In the United States before the Civil War, it was legal to own slaves and **illegal** to free another person's slaves. But owning slaves is exceedingly immoral, and freeing them exceedingly moral. Law and morality pointed in opposite directions.

## They often overlap

At the same time, the two frequently coincide. It is illegal to kill people (except in self-defense), and it is also immoral to do so (same qualification). Much of the law tracks morality reasonably well.

## A delicate relationship

*How* legality and morality are related is a subtle question, not settled by either of the points above. What this course insists on is only the **distinction**: that an act is legal does not make it moral, and that an act is illegal does not make it immoral. Confusing "it's the law" with "it's right" — in either direction — is one of the most common and most dangerous mistakes in practical ethics.

## In the real world

Under the Fugitive Slave Act of 1850 it was *illegal* to help an escaped enslaved person — yet Harriet Tubman's work on the Underground Railroad was deeply *moral*. A century later, it was illegal for Rosa Parks to keep her bus seat in 1955, and unmistakably moral. Law and morality can point in opposite directions; "it's the law" never settles "it's right."`,
  },

  // Unit 3 — Acts, Agents, and Judgment
  {
    slug: "judging-vs-status",
    title: "Judging X vs. the status of X",
    weekNumber: 3,
    blurb: "The morality of passing judgment differs from the morality of the act.",
    lectureTitle: "3.1 Judging X vs. the moral status of X",
    body: `# Judging an act vs. the act itself

The moral status of **passing judgment** on X is *not* the same as the moral status of **X itself**.

## An everyday parallel

Given only that an object weighs 200 pounds, I do not automatically have the *right* to say it does — I might lack the information. Given only that a statement is true, I do not automatically have the right to assert it; I have that right only if I have good reason to believe it.

## The ethical consequence

Suppose Jones is on trial for a murder he in fact committed, but the jury lacks the evidence to know he is guilty. Jones's act is **condemnable** — murder is wrong. Yet the jury does **not** have the right to convict him, because the jury does not *know* he is guilty. It would be **condemnable of the jury** to convict a person it does not know to be guilty, even if that person happens to be guilty.

## The general principle

Even when an act *is* condemnable, one does not automatically have the right to condemn it. One has that right only with sufficient information. To condemn without it is itself to act condemnably — making an accusation one does not know to be correct, even if by coincidence it is. The striking upshot: **it can be condemnable to condemn the condemnable.**

## In the real world

In 1990, five teenagers — the "Central Park Five" — were convicted of a brutal assault on the strength of coerced confessions and almost no physical evidence; DNA exonerated them in 2002. Convicting someone you do not *know* to be guilty is wrongful even if they happen to be guilty. Here the boys were innocent, which only sharpens the lesson: the act of condemning on insufficient grounds was condemnable in its own right.`,
  },
  {
    slug: "act-vs-agent",
    title: "Goodness of the act vs. goodness of the agent",
    weekNumber: 3,
    blurb: "Praise and blame track intention, not outcome.",
    lectureTitle: "3.2 The act vs. the agent: intention is what counts",
    body: `# The act vs. the agent

Whether an agent deserves praise or blame depends **not on what they actually bring about, but on what they intend** to bring about.

## Kathy and Mary

**Kathy**, a devoted mother of five, researches carefully, concludes supplement X will help her children, works extra hours to buy it, and feeds it to them. They thrive. Kathy deserves commendation: she did the right thing, and she *intended* to.

**Mary** is psychologically identical to Kathy — same care, same research, same intentions. The evidence available to her points to supplement Y. She works extra to buy it and feeds it to her kids. But Y, despite all testing, turns out to be slowly lethal, and her children die.

Mary did not do "the right thing." But is she **morally worse** than Kathy? No. Her intentions were exactly Kathy's. The only difference is that the world met Kathy halfway and did not meet Mary halfway. **They are equally worthy of praise**, even though one brought about a tragedy.

## Betty

**Betty**, bored with motherhood, intends to kill her children and feeds them substance Z, believed lethal and undetectable. But Z happens to be beneficial to children of their rare blood type, and they flourish. Betty produced a **good** outcome — yet she deserves **condemnation of the severest kind**, because it was her intention to do evil.

## The principle

Praise and blame attach to the **agent's intention**, not to the result. Good outcomes from evil intentions earn no praise; tragic outcomes from good intentions earn no blame.

## In the real world

In the thalidomide tragedy (late 1950s–1962), doctors who prescribed the drug for morning sickness acted on the best evidence available and intended only to help — yet roughly 10,000 babies were born with severe defects. Those doctors are not on a moral par with the manufacturer that suppressed safety warnings. Same terrible outcome; the blame tracks who *intended* what, not what happened to result.`,
  },
  {
    slug: "intention-attempts",
    title: "Intention and the punishment of attempts",
    weekNumber: 3,
    blurb: "Why law punishes attempts less, and why that's consistent.",
    lectureTitle: "3.3 Why attempts are punished less severely",
    body: `# Why attempts are punished less severely

Attempted murder is punished less harshly than murder. Why — if praise and blame track intention, not outcome?

## Failure is evidence of a weaker intention

Failure to carry out a plan often (not always) suggests the person's **heart wasn't fully in it**. If a smart man flunks out of law school ten times, his heart may not be in it. If a would-be murderer's gun jams, it may be because he never checked it — and a truly resolute killer might have made sure it worked. His failure may reflect reservations, possibly even *moral* reservations.

## The same holds for good deeds

Suppose you keep agreeing to visit a tiresome ailing aunt, and every time some genuine obstacle arises — lost keys, sudden inspiration, an urge to clean. The obstacles are real and not consciously contrived. But that they *always* arise, given how you dread the visits, suggests your intention to go is **feeble**. This is why those who actually carry out good deeds receive more commendation than those who merely attempt them.

## Why this is consistent

It remains true that two people with *exactly* the same intentions deserve exactly the same praise or blame, success or not. But as a **general rule**, success or failure is *evidence* about how resolute the intention was. Those who succeed at crimes are, on average, less conflicted about wanting to. So punishing attempts less severely is consistent with the view that intention — not outcome — is what we are really judging.

## In the real world

In most legal systems, attempted murder is typically punished less severely than a completed murder — for example, under English law murder carries a mandatory life sentence while attempted murder does not. The justification fits this section: on average, those who actually go through with a killing were more resolved to do it, while a failure can be evidence of a fainter, more conflicted intention. The law is, in effect, judging the firmness of the intention.`,
  },
  {
    slug: "hitler-problem",
    title: "Good intentions and condemnation (the Hitler problem)",
    weekNumber: 3,
    blurb: "Can someone be condemned even if they 'meant well'?",
    lectureTitle: "3.4 The Hitler problem",
    body: `# The Hitler problem

If blame tracks intention, an objection arises: it is agreed that Hitler's acts were wrong and that he deserves condemnation. But "**wasn't it his intention to do good**? His efforts were misguided, but mustn't we say his intentions were good — and isn't that inconsistent with the claim that condemnation tracks intention, not deeds?"

## The response

The premise is false: it pretty clearly was **not** Hitler's intention to do good. (And even if some such intention existed, it was grossly **outweighed** by other intentions.)

Of course he never announced, "It's my intention to do evil." But public speeches tell us nothing about real intentions. Given how obvious it is to anyone of even minimal intelligence that gratuitous torture and murder are wrong, it is **not feasible** to suppose that, as a rule, Hitler's intentions were good ones.

## The general lesson

The "good intentions" defense cannot be granted on a person's say-so, nor inferred from the fact that they cloak their aims in noble language. We judge intentions by the **whole pattern of conduct** and by what any minimally reasonable person in their position would have known. Properly understood, the Hitler case does not refute the intention-based view of blame — it illustrates how to read intentions honestly rather than naively.

## In the real world

At his 1961 trial in Jerusalem, Adolf Eichmann insisted he had merely "followed orders" and meant no evil. The court judged him not by his self-description but by the whole pattern of his conduct — and convicted him. Hannah Arendt's phrase "the banality of evil" captures the point: the "good intentions" defense cannot be granted on a defendant's say-so.`,
  },
  {
    slug: "immorality-toward-self",
    title: "Immorality toward oneself",
    weekNumber: 3,
    blurb: "Can one act immorally toward oneself?",
    lectureTitle: "3.5 Can one act immorally toward oneself?",
    body: `# Can one act immorally toward oneself?

This is controversial, but the answer defended here is **yes**. One can sell oneself short, act self-destructively, and do to oneself things one has a right not to undergo.

## Ways of wronging oneself

There are many: being **too easy** on oneself (permitting every excess — drugs, binge-eating) and being **too hard** on oneself (pushing too hard, setting impossibly high standards). The list is far from complete.

## Not the same category as harming others

This does not put self-harmers in the same moral category as those who harm others. People who hurt themselves are often (not always) **hyper-principled**, whereas those who hurt others are often (not always) lacking in principle.

## Principle-driven can still be wrong

"But you said self-harmers behave immorally, and you also call them hyper-principled — isn't that inconsistent?" No. That an act is **principle-driven does not make it right**. There are many ethical principles, and not all are good. Some people felt it their *duty* to support Hitler — that was a principle, just a bad one. By acting on similarly misguided principles, people can wrong **themselves**.

It is even argued elsewhere that, in a sense, *all* acts of immorality are ultimately acts of immorality toward oneself — a thought the next section pursues through the question of punishment.

## In the real world

Japan recognizes *karoshi* — death from overwork — as a documented cause of death; the 2015 suicide of 24-year-old Dentsu employee Matsuri Takahashi after extreme overtime became a national scandal. Such overwork is often driven by a *principle*: devotion, duty, never letting the team down. That the conduct is principle-driven does not make it right — one can wrong *oneself* by acting on a misguided principle.`,
  },
  {
    slug: "self-harm-autonomy",
    title: "Self-harm, punishment, and autonomy",
    weekNumber: 3,
    blurb: "Why we don't punish self-harm — and what that does and doesn't show.",
    lectureTitle: "3.6 Self-harm, punishment, and autonomy",
    body: `# Self-harm, punishment, and autonomy

A common argument: people who harm *others* deserve punishment, while people who harm *themselves* do not; therefore self-destructive behavior is **not immoral**, even if bad in some other way.

## The argument is not probative

This reasoning is weak, because **desert of punishment is not solely a function of having done wrong**. If the good done by punishing someone is grossly outweighed by the harm it does, punishing may be wrong even when wrong was done.

Take little Timmy, who steals a cookie. It was not good of him. But suppose Timmy is emotionally fragile and would completely break down if punished. Then it is probably better to give him a pass — *not* because he did no wrong, but because punishing would do more harm than good.

## Why we don't punish self-harm

Two further reasons. **First**, self-destructive behavior is *its own punishment*; an externally imposed punishment would be redundant — adding insult to injury. **Second**, punishing such a person would violate their **autonomy** — their right to determine their own fate — which might be ethically *worse* than what they did to themselves.

## The conclusion

So the fact that we (rightly) refrain from punishing self-harm does **not** show that self-harm is morally permissible. It shows only that **wrongdoing and desert-of-punishment are separate questions**. An act can be genuinely wrong even when punishing it would be the worse course.

## In the real world

Britain's Suicide Act of 1961 decriminalized attempted suicide. The aim was not to declare the act morally fine, but to recognize that punishing it would add cruelty to suffering and violate the person's autonomy. That we rightly refuse to punish self-harm shows only that wrongdoing and desert-of-punishment are separate questions.`,
  },

  // Unit 4 — Metaethics and Moral Truth
  {
    slug: "ought-from-is",
    title: 'Metaethics: deriving "ought" from "is"',
    weekNumber: 4,
    blurb: "Can value-judgments follow from purely factual ones?",
    lectureTitle: '4.1 Can you derive an "ought" from an "is"?',
    body: `# Metaethics and the is–ought question

**Metaethics** asks what, if anything, ethical statements *mean*. A **valuative** statement is one that expresses a value-judgment — it says something should or should not be done, or that something is or is not good. ("Valuative" means roughly the same as "ethical" or "having ethical content.")

## The classic principle

One famous principle says: **you cannot derive an "ought" from an "is."** If you had a complete list of all true *non-valuative* statements, the claim goes, you still could not justifiably infer any valuative statement — you could never reach "it is obligatory that you do X."

## Why it may be false

Though widely accepted, the principle may well be **false**. Consider two popular moral doctrines:

- "X is a good act" means *X makes people happier than the available alternatives.*
- "X is a good act" means *X promotes the actualization of human potential more than the alternatives.*

If either doctrine — or anything like it — is correct, then an "ought" **can** be inferred from an "is." For "X is what ought to be done" would follow from the factual claim "X is more likely than the alternatives to maximize happiness (or human flourishing)."

## The upshot

So the is–ought barrier is not obviously a barrier at all. Whether it stands depends on substantive questions about what goodness *consists in* — questions metaethics must actually argue, not assume. This sets up Moore's more famous version of the objection.

## In the real world

U.S. regulatory agencies routinely assign a "value of a statistical life" (the EPA has used figures around $10 million) and then derive what safety rules *ought* to be enacted from factual cost-and-risk data. Whatever one thinks of the practice, it is a working example of moving from an *is* (measured risks and benefits) to an *ought* (this regulation should be adopted) — exactly what the is–ought principle says cannot be done.`,
  },
  {
    slug: "open-question",
    title: "Moore's open-question argument",
    weekNumber: 4,
    blurb: "Are moral facts reducible to natural facts?",
    lectureTitle: "4.2 Moore's open-question argument",
    body: `# Moore's open-question argument

G. E. Moore argued that **no amount of purely descriptive, non-moral information is enough to settle a moral judgment**.

## The argument

- **Premise:** No matter how many *factual* truths you know about X, it remains an "open question" whether X is good.
- **Conclusion:** Ethical truths are therefore **not identical with, or reducible to, factual statements.**

The idea is that for any natural property you propose to identify with goodness, you can always still sensibly ask, "but is a thing with that property *good*?" — so goodness must be something over and above any natural fact.

## Why the argument fails

The premise is **false**. As we just saw, if goodness has anything to do with maximizing happiness or human flourishing, then enough factual information *does* settle the moral question.

More directly, the premise is **deeply implausible**. If I know that X is a person who kills others for fun, delights in their pain, and never does anything for anyone, then it is **not** an open question whether X is good. The "openness" simply evaporates once the facts are bad enough. So Moore's argument is no good.

## Why the next section matters

Why did Moore find the question "open" even when the facts are damning? The next section diagnoses the deeper error: a faulty conception of **entailment**.

## In the real world

When Allied forces documented the Nazi death camps in 1945 and presented the evidence at Nuremberg, it was simply *not* an "open question" whether the Holocaust was evil. Moore's claim that no set of facts can ever close the moral question collapses here: once the facts are damning enough, the "openness" disappears entirely.`,
  },
  {
    slug: "entailment-ampliative",
    title: "Entailment as ampliative",
    weekNumber: 4,
    blurb: "Deduction can add to what you know.",
    lectureTitle: "4.3 Entailment is ampliative",
    body: `# Entailment is ampliative

The hidden assumption behind Moore's argument (and Hume's) is a **faulty theory of entailment**.

## The standard view

It is often said that P entails Q only if "there is nothing in Q that isn't already in P" — that entailment is **non-ampliative**, that deduction never *adds* to what you know. On this view, if Jones tortures babies for fun and frames others for it, the badness of Jones still doesn't "follow," because deduction can't deliver anything genuinely new.

## Why it is false

Entailment is in fact **ampliative**. Sure, some cases are trivial ("if P and Q, then Q"), but these are the exception, not the rule. That 1 + 1 = 2 *entails*, by long chains of deduction, that there are continuous functions differentiable nowhere, and that space is metrically amorphous — results no one "sees" in "1 + 1 = 2."

If deduction really added nothing, then those who reason would know no more than those who merely live in the moment — our Pleistocene ancestors would be as knowledgeable as we are. That is absurd. Without deduction we could never organize raw experience into theories at all.

## The payoff for ethics

Once we accept that deduction **extends** knowledge, Moore's "open question" loses its grip. From a rich enough set of facts about Jones, the conclusion that Jones is bad genuinely *follows* — even though the word "bad" never appeared among the premises. The newness of the conclusion is no objection; that is just what good inference does.

## In the real world

In 1846 Urbain Le Verrier deduced the existence and location of an unseen planet purely from anomalies in Uranus's orbit, using Newton's laws; astronomers pointed their telescopes and found Neptune within a degree of his prediction. No one "saw" Neptune in the equations — yet it followed from them. Deduction genuinely *extends* knowledge, which is why Moore's "nothing new can follow" assumption fails.`,
  },
  {
    slug: "genetic-vs-normative",
    title: "Genetic vs. normative questions",
    weekNumber: 4,
    blurb: "Where a belief came from is not whether it's true.",
    lectureTitle: "4.4 The genetic fallacy in ethics",
    body: `# Genetic vs. normative questions

We must sharply separate **where a belief came from** (the *genetic* question) from **whether it is true** (the *normative* question).

## The Newton example

Legend says Newton hit on the inverse-square law after an apple struck his head. The random, ignominious origin of the idea is **irrelevant** to whether it is correct. What makes an idea correct is whether it *fits the facts* — not who thought of it or how. Ideas reached by impeccable reasoning can be false; ideas reached illogically can be perfectly true. To judge a belief by its origin rather than its fit with the facts is to commit the **genetic fallacy**.

## Applied to morality

Suppose anthropologists discovered that our belief that torturing infants is wrong descended from an ancient cult of a "Volcano god" who supposedly abhorred it. Would that show the belief is **false**? No. It would show our *original grounds* were bad — but a belief with bad original grounds can be true, and we may since have replaced those grounds with good ones (just as a child who believes the Earth is round "because he likes round things" can later acquire real evidence).

## The religion twist

Views actually reached for ordinary reasons are often *redescribed* as divinely revealed, because "God told me X" wins more believers than "my own intellect told me X." But notice: people only believe "God said X" when they *already* find X plausible. Tell people God told you to destroy hospitals and no one believes you; tell them God told you to be kind and a few might. So the appearance of a genetic origin is frequently an illusion — the real grounds were the merits all along.

## In the real world

August Kekulé said the ring structure of benzene came to him in a daydream of a snake seizing its own tail. The bizarre origin of the idea has no bearing on its correctness — and the structure *is* correct, confirmed by a century and a half of chemistry. To judge a belief by where it came from rather than whether it fits the facts is the genetic fallacy.`,
  },
  {
    slug: "truth-vs-use",
    title: "Moral truth vs. its uses and implementation",
    weekNumber: 4,
    blurb: "Abuse and late discovery don't refute moral truth.",
    lectureTitle: "4.5 Moral truth vs. its uses and implementation",
    body: `# Moral truth vs. its uses and its implementation

Two further confusions must be cleared away: confusing a moral truth with the **use** it is put to, and confusing a moral principle with its **social implementation**.

## Use does not impugn truth

Many moral statements *are* pure propaganda — cynical manipulations meant to advance some nefarious agenda. Even **correct** moral statements can be put to evil use: Stalin, climbing to power, often preached the importance of "mercy for one's political rivals." Mercy is genuinely good — but it does not follow that Stalin did good in invoking it, for his use of the principle was deceptive. And conversely: that self-interested actors *call* something a moral truth does not make it one. But — crucially — from the fact that an *alleged* moral truth is false, **it does not follow that there is no moral truth** (just as fake "physical laws" don't show there are no physical laws).

## Discovery is not invention

It is often argued that morality has no objective basis because it is a "human creation" that "came into existence a few thousand years ago." This commits two errors. **First**, there was a time when people first *became aware* the Earth is round — but the Earth was round long before. Likewise, that people became aware of moral truths at some point does not mean those truths were *invented* then. **Second**, it confuses moral principles with the **institutions that enforce them**. Enforcement requires society; the principle does not. Even with no society at all, it is wrong to gouge out someone's eyes for fun. Calculators implementing the laws of arithmetic were built in the 1800s, but those laws existed long before the machines. The same holds for moral law.

## In the real world

Slavery was formally abolished in the British Empire in 1833 and in the United States in 1865 — but its wrongness was not *invented* on those dates. People became *aware* of it and built institutions to enforce that awareness; the moral truth preceded the enforcement, just as the Earth was round before anyone proved it. Late discovery and social implementation are not the same as creation.`,
  },
  {
    slug: "reject-realism",
    title: "Bad reasons to reject ethical realism",
    weekNumber: 4,
    blurb: "Disagreement does not show morality is mere opinion.",
    lectureTitle: "4.6 Bad reasons to reject ethical realism",
    body: `# Bad reasons to reject ethical realism

A popular argument: there is *more disagreement* in ethics than in other fields; therefore ethical statements merely express **opinion**, with no objective basis — so they are either meaningless or categorically false.

## Four problems with this argument

**(i)** There is a great deal of disagreement about **strictly factual** matters too — yet we do not conclude that facts are mere opinion.

**(ii)** Even if there is *more* disagreement in ethics, that does not show ethical claims lack an objective basis. Certain kinds of disagreement actually **presuppose** objective fact, and there is evidence that ethical disagreement is often of this kind.

**(iii)** There is in fact a great deal of **agreement** in ethics; the contrary impression rests largely on misleading appearances. (We notice the controversies, not the vast shared background.)

**(iv)** Much "ethical" disagreement is really disagreement about **matters of fact**, not matters of value — about *what will happen* or *what is the case*, not about what is good.

## The upshot

None of this *proves* ethical realism. But it dismantles the single most common argument *against* it. The mere existence of moral disagreement — even widespread disagreement — is not evidence that there is no moral truth. The next section makes (i) and (iv) concrete.

## In the real world

For decades physicians were sharply divided about what causes stomach ulcers, most blaming stress and diet. In 1984 Barry Marshall drank a culture of *H. pylori* to prove bacteria were the cause; he and Robin Warren won the 2005 Nobel Prize. There was fierce disagreement — and still a definite fact of the matter. Disagreement alone never shows there is no truth.`,
  },
  {
    slug: "disagreement-fact-value",
    title: "Disagreement, fact, and value",
    weekNumber: 4,
    blurb: "Rational debate is the mark of objective truth.",
    lectureTitle: "4.7 Disagreement, fact, and value",
    body: `# Disagreement, fact, and value

To see why disagreement does not doom moral realism, compare two statements.

## A contested factual claim

**(KV)** "If Kennedy hadn't been assassinated, the U.S. would have pulled out of Vietnam before 1970."

KV is **not** a value-judgment — it asserts a causal relation. It is extremely hard to know whether KV is true, and there is no unanimity about it. Yet it is surely **not "just a matter of opinion."** The decisive mark: it makes sense to **cite reasons for and against it** — a speech JFK had drafted, newly uncovered documents about LBJ's views, and so on. KV can be weighed against documents, footage, and testimony. Difficulty of resolution is **not** the same as mere subjectivity.

## A genuine matter of taste

**(CB)** "Chocolate ice cream is better than vanilla" (not nutritionally).

Here there is little I can do to defend my position beyond "I like chocolate more." Reasons get no grip. CB really *is* a matter of opinion.

## The lesson

The test for whether a statement is **truth-apt** is whether reasons can rationally bear on it. Many moral disputes are like **KV**, not **CB**: people marshal evidence, draw distinctions, and change their minds under argument — which is exactly what we would expect if there were a fact of the matter. And much apparent *moral* disagreement turns out, on inspection, to be **factual** disagreement (about consequences, circumstances, who did what) riding underneath a shared value.

## In the real world

Whether smoking causes lung cancer was, for years, genuinely contested — the tobacco industry funded the doubt. But it was never "just a matter of opinion": the Doll–Hill studies of the 1950s and the 1964 U.S. Surgeon General's report let reasons and evidence settle it. A question is truth-apt when evidence can rationally bear on it, however heated the disagreement.`,
  },
  {
    slug: "capstone-ethical-truths",
    title: "Capstone: what are ethical truths?",
    weekNumber: 4,
    blurb: "Synthesizing the course into a view of moral truth.",
    lectureTitle: "4.8 Capstone synthesis: what are ethical truths?",
    body: `# Capstone: what are ethical truths?

This final section ties the course together. Each earlier idea is a thread; the question "what *are* ethical truths?" is where they meet.

## What we have established

- **Value is layered.** "Good" splits into instrumental and intrinsic; intrinsic good splits into commendable and merely good; badness splits the same way. Moral attributes are **positive, not privative** — which is why one act can be good *and* bad, commendable *and* condemnable.
- **Right and wrong are comparative.** "Right" = least bad available; "wrong" = least good available. Neither equals "good" or "bad." Obligations have **weight**, and an outweighed obligation is overridden, not erased.
- **We judge agents by intention.** Outcomes can mislead (Kathy, Mary, Betty); attempts are punished less because failure is evidence of a weaker intention; and the moral status of *judging* differs from the status of the act judged.
- **Metaethics defends moral truth.** "Ought" may follow from "is"; Moore's open-question argument fails once we see entailment is **ampliative**; and the genetic fallacy, the abuse of moral language, the late *discovery* of morality, and the mere fact of *disagreement* are all **bad reasons** to deny that there are moral truths.

## A capstone problem

> A government can save more lives overall only by enacting a policy that knowingly, deliberately harms a small, blameless group. Is enacting it *right*? Is it *good*? Does the residual obligation to the harmed group survive? Would a leader who enacts it with the *intention* of protecting the powerful deserve the same praise as one who enacts it reluctantly to save lives?

Answering this well requires the *whole course*: the intrinsic/instrumental distinction, weight and outweighing, "right" as least-bad, intention-based judgment of agents, and a clear-eyed view of whether there is a fact of the matter at all. **That** is ethical reasoning.

## In the real world

Internal documents in the Ford Pinto case (1970s) showed the company weighing the cost of paying out wrongful-death claims against the cost of recalling a fuel-tank defect it knew could kill — knowingly trading a small number of lives against money. Judging it well takes the whole course: Is it *right* (least bad) or merely cost-minimizing? Is it *good*? Does the obligation to the harmed survive? And does the *intention* — protecting profit versus protecting people — change the verdict on the agents?`,
  },
];

type SeedAssignment = {
  kind: "homework" | "test" | "midterm" | "final";
  title: string;
  weekNumber: number;
  isTimed: boolean;
  timeLimitMinutes: number | null;
  instructions: string;
  problems: Array<{
    topicSlug: string;
    prompt: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  }>;
};

const ASSIGNMENTS: SeedAssignment[] = [
  // Unit 1
  {
    kind: "homework",
    title: "Homework 1.1 — Statements, categories, kinds of goodness",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 3–5 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "what-is-ethics", prompt: "Explain the difference between descriptive and normative statements, give one original example of each, and explain why this distinction matters for ethics. (3–5 sentences.)", correctAnswer: "A descriptive statement reports how things actually are and can be checked by observation — for example, 'Water boils at 100°C at sea level.' A normative statement evaluates something against a standard, saying how things ought to be or what has value — for example, 'People ought to keep their promises.' The distinction matters because ethics is the study of normative claims: it asks not what people in fact do but what they have reason to do or what is genuinely good, so it cannot be settled by description alone.", explanation: "Full credit: clearly separates fact-reporting from value-judgment, gives a valid example of each, and notes that ethics is normative." },
      { topicSlug: "what-is-ethics", prompt: "Some people argue that because we can describe what a society approves of, ethics is just a branch of sociology. Explain why this reasoning is mistaken. (3–5 sentences.)", correctAnswer: "Describing what a society approves of is a descriptive project: it records the attitudes people happen to have. Ethics asks a different, normative question — whether those attitudes are justified, i.e., whether the things approved of are actually good or right. A society could approve of slavery, but that descriptive fact does not make slavery right, so the normative question survives untouched. Because no catalogue of facts about approval settles the question of justification, ethics cannot be reduced to sociology.", explanation: "Full credit: separates the descriptive question (what is approved) from the normative one (whether approval is warranted), with an illustration." },
      { topicSlug: "normative-categories", prompt: "Is 'noble' a normative or a descriptive category? Defend your answer, and explain how you can tell the two kinds of category apart in general. (3–5 sentences.)", correctAnswer: "'Noble' is a normative category, because to call an act or person noble is to praise them against a standard of worth, not merely to report a neutral fact. The general test is whether a term can appear in a purely factual report or whether using it commits you to a value-judgment: descriptive categories like 'tall' or 'metallic' can be applied without endorsing or condemning anything, whereas normative categories like 'noble', 'cruel', or 'admirable' carry built-in evaluation. Since you cannot sincerely call something noble while denying it is in any way good, the term is normative.", explanation: "Full credit: classifies 'noble' as normative and articulates a general criterion (evaluation built into the term)." },
      { topicSlug: "instrumental-intrinsic", prompt: "Distinguish instrumental from intrinsic goodness, then explain why an act that is very useful to the person who does it (such as enriching themselves by exploiting others) can still fail to be good in the sense ethics cares about. (3–5 sentences.)", correctAnswer: "Something is instrumentally good if it is good as a means to some further end, and intrinsically good if it is good in itself, independent of what it leads to. Enriching yourself by exploiting others may be highly instrumentally good for you, since it efficiently serves your aim of getting rich. But ethics is concerned with intrinsic goodness, and an act of exploitation is not good in itself; its usefulness to the agent does nothing to redeem it. So an act can be instrumentally excellent and intrinsically bad at the same time.", explanation: "Full credit: defines both senses and explains that instrumental value to the agent does not confer the intrinsic value ethics evaluates." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Commendableness, badness, and mixed acts",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 3–5 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "goodness-commendableness", prompt: "A contented animal experiences something intrinsically good (its own well-being), yet we don't praise it for being good. Explain what this shows about the relationship between goodness and commendableness. (3–5 sentences.)", correctAnswer: "It shows that goodness and commendableness are distinct properties that can come apart. The animal's contentment is intrinsically good — a good state of affairs — but commendableness (praiseworthiness) attaches to agents for what they bring about through their own rational agency, and the animal does not choose or strive for its well-being. Because praise presupposes the kind of agency the animal lacks, something can be genuinely good without anyone being commendable for it. So 'this is good' and 'this is to someone's credit' are separate judgments.", explanation: "Full credit: distinguishes intrinsic goodness from praiseworthiness and ties commendableness to agency." },
      { topicSlug: "two-kinds-badness", prompt: "Explain why a grieving person's suffering is intrinsically bad yet not condemnable, and use the case to explain the general difference between something being bad and something being blameworthy. (3–5 sentences.)", correctAnswer: "The grief is intrinsically bad because suffering is a state we have reason to regret in itself. But it is not condemnable, because condemnation targets faulty agency — ill will, recklessness, or wrongdoing — and the grieving person has done nothing wrong; the suffering simply befalls them. In general, then, 'bad' evaluates a state or outcome while 'condemnable' evaluates an agent's conduct or will. Many bad things, such as illness, accidents, and grief, are nobody's fault, which is exactly why badness and blameworthiness must be kept apart.", explanation: "Full credit: identifies the grief as intrinsically bad but blameless and generalizes to badness-of-state vs. blameworthiness-of-agent." },
      { topicSlug: "morally-complex", prompt: "Someone plays music beautifully and takes genuine joy in it, but knowingly keeps a seriously ill housemate who badly needs sleep awake. Explain in what respect the act is good and in what respect it is condemnable, and what this shows about moral evaluation. (3–5 sentences.)", correctAnswer: "The act is intrinsically good in one respect: skilled music-making and the joy taken in it are genuine goods. Yet the very same act is condemnable in another respect, because the person knowingly inflicts serious harm on someone who needs rest. This shows that a single act can carry more than one moral property at once, so moral evaluation is not a simple good-or-bad verdict. We have to assess acts along several dimensions rather than forcing them onto a single scale.", explanation: "Full credit: identifies the good aspect and the condemnable aspect and concludes that one act can bear multiple moral properties." },
      { topicSlug: "non-privative", prompt: "Some philosophers claim badness is merely the absence of goodness, the way darkness is the absence of light. Argue against this view, and explain what follows for whether one act can be both good and bad. (3–5 sentences.)", correctAnswer: "The 'absence' view is mistaken because badness is typically the presence of something positive, not a mere lack — cruelty, for instance, is not the absence of kindness but the active presence of ill will directed at suffering. If badness were just the absence of goodness, nothing could be good and bad at once, since presence and absence exclude each other. But because both goodness and badness are positive properties, a single act can possess both simultaneously. So the privative model fails to capture morally mixed acts.", explanation: "Full credit: argues badness is positive (presence of something), not privative, and draws the consequence that one act can be both good and bad." },
    ],
  },
  {
    kind: "test",
    title: "Unit 1 Test — Foundations of Value",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions: "Timed. 30 minutes. Answer each question in a short paragraph (about 4–6 sentences) in your own words. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      { topicSlug: "what-is-ethics", prompt: "Define what ethics studies and explain how its central questions differ from those of an empirical science like psychology. Give an example that brings out the contrast. (4–6 sentences.)", correctAnswer: "Ethics studies normative questions — what is good, right, or worthy of praise, and why — rather than merely what is the case. An empirical science like psychology describes and predicts how people actually think and behave; it tells us, for instance, that most people feel guilt after breaking a promise. Ethics asks the further question of whether breaking the promise was actually wrong and whether the guilt is warranted, which no amount of behavioral data can settle. The contrast is that psychology answers 'how do people in fact respond?' while ethics answers 'how ought one to act, and what really has value?' The two can study the same situation while asking fundamentally different kinds of question.", explanation: "Full credit: characterizes ethics as normative, contrasts it with descriptive/empirical inquiry, and gives a discriminating example." },
      { topicSlug: "instrumental-intrinsic", prompt: "Explain the difference between intrinsic and instrumental goodness, and argue for which kind ethics is ultimately concerned with. Use an example of something that has both kinds of value. (4–6 sentences.)", correctAnswer: "Something is instrumentally good if it is valuable as a means to a further end, and intrinsically good if it is valuable in itself. Knowledge is a good example of something with both: it is instrumentally good because it helps us achieve countless goals, and arguably intrinsically good because understanding is worth having for its own sake. Ethics is ultimately concerned with intrinsic goodness, because instrumental value always borrows its worth from some end, and unless something is good in itself the whole chain of means would be valueless. So while ethics can note usefulness, its fundamental subject is what is good in itself.", explanation: "Full credit: defines both, gives a dual-value example, and argues ethics' ultimate concern is intrinsic value." },
      { topicSlug: "goodness-commendableness", prompt: "Explain why some intrinsic goods are commendable while others are not, and give one example of each. What general principle determines which goods are to someone's credit? (4–6 sentences.)", correctAnswer: "Some intrinsic goods result from an agent's own rational choice and effort, and these are commendable — for example, a person who deliberately acts with courage to help others deserves praise. Others are intrinsically good states that no one brought about through praiseworthy agency, such as the simple contentment of a young child, which is good but not to anyone's credit. The general principle is that commendableness attaches to goods that flow from an agent's will and choice, not to goods that merely occur. So whether a good is praiseworthy depends on whether responsible agency produced it.", explanation: "Full credit: distinguishes praiseworthy from non-praiseworthy goods with examples and states the agency principle." },
      { topicSlug: "two-kinds-badness", prompt: "Distinguish intrinsic badness that is condemnable from intrinsic badness that is not, giving an example of each, and explain why the distinction matters morally. (4–6 sentences.)", correctAnswer: "Some intrinsically bad things stem from culpable agency and are condemnable — for example, a person who deliberately humiliates another out of malice. Other intrinsically bad things are blameless misfortunes, such as the pain of someone who has fallen seriously ill through no fault of their own; the pain is bad but no one is to blame for it. The distinction matters because the appropriate response differs sharply: condemnable badness calls for blame, correction, or punishment, while blameless badness calls for compassion and aid, not censure. Treating all badness as if it were someone's fault would be both unjust and cruel.", explanation: "Full credit: gives a condemnable and a blameless example of intrinsic badness and explains the moral stakes of the distinction." },
      { topicSlug: "non-privative", prompt: "Explain why a single act can be both commendable and condemnable at the same time, and why this would be impossible if these were 'privative' (absence-based) properties. (4–6 sentences.)", correctAnswer: "A single act can be both commendable and condemnable because each is a positive property grounded in a different feature of the act — one might act with admirable courage (commendable) while doing so in a needlessly cruel way (condemnable). If these properties were privative, so that 'condemnable' just meant 'lacking commendableness,' then nothing could be both at once, since an act cannot both have and lack the same feature. But because each property is the presence of something real rather than the mere absence of the other, they can coexist in one act. This is why moral life so often involves acts that genuinely deserve both praise and blame.", explanation: "Full credit: explains coexistence via the positivity of both properties and the contradiction the privative view would create." },
    ],
  },

  // Unit 2
  {
    kind: "homework",
    title: "Homework 2.1 — Weight, outweighing, and 'right'",
    weekNumber: 2,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 3–5 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "weight-of-obligations", prompt: "Some people assume all moral obligations are equally binding. Explain why this is false, and describe how we can tell that one obligation is weightier than another. Use an example. (3–5 sentences.)", correctAnswer: "Obligations are not all equal: a trivial promise to meet someone for coffee is far less binding than the duty not to endanger an innocent person's life. We can tell that one obligation outweighs another by what a reasonable person ought to do when the two conflict — if it would be wrong to keep the coffee date at the cost of letting someone come to serious harm, the duty to prevent harm is weightier. The stakes involved, the vulnerability of those affected, and the degree of trust at issue all raise an obligation's weight. So obligations come in degrees and must be compared, not treated as uniform.", explanation: "Full credit: rejects equal weighting, gives a comparative criterion (what should win in conflict / stakes), and illustrates." },
      { topicSlug: "outweigh-vs-cancel", prompt: "When a stronger obligation outweighs a weaker one, the weaker one is not simply erased. Explain the difference between an obligation being outweighed and being cancelled, and why 'moral residue' is evidence for this. (3–5 sentences.)", correctAnswer: "An obligation is outweighed when a stronger duty takes priority but the weaker duty remains real; it is cancelled only if it ceases to make any claim on us at all. The evidence that outweighing is not cancelling is moral residue: after you justifiably break a small promise to handle an emergency, you still owe the person an apology or amends, which would make no sense if the promise had simply vanished. The lingering obligation to make it right shows the original duty persisted through the conflict. So overriding a duty is not the same as eliminating it.", explanation: "Full credit: contrasts overriding with cancelling and cites residual duties (apology/amends) as evidence the obligation persists." },
      { topicSlug: "right-least-bad", prompt: "Explain the idea that the right action is the 'least bad available option,' and use it to explain how the right thing to do can still be a bad thing. (3–5 sentences.)", correctAnswer: "On this view, rightness is comparative: the right action is whichever of the genuinely available options is least bad, given the circumstances. This allows the right action to still be a bad thing in absolute terms — in a tragic situation where every option causes some harm, choosing the one that causes the least harm is right even though it remains regrettable. Rightness here measures relative standing among options, not absolute goodness. So calling an act 'right' is compatible with admitting it is, in itself, bad.", explanation: "Full credit: explains comparative rightness (least bad option) and that the right act can be bad in absolute terms." },
      { topicSlug: "right-least-bad", prompt: "Is the right act always a good act? Defend your answer using the idea of forced choices among bad options. (3–5 sentences.)", correctAnswer: "No, the right act is not always a good act. When every available option is bad — as in a genuine dilemma where one must choose which harm to allow — the right choice is simply the least bad one, and the least bad of several bad options is still bad. Calling such a choice 'right' means it is the best one could do, not that it is good in itself. So rightness and goodness can diverge whenever the situation offers no good option at all.", explanation: "Full credit: answers 'no' and supports it with the forced-choice-among-bads reasoning." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 2.2 — 'Wrong', 'ought', and law",
    weekNumber: 2,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 3–5 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "wrong-least-good", prompt: "Explain the idea that a wrong action is the 'least good available option,' and why this surprisingly implies that a wrong act can still be a good one. (3–5 sentences.)", correctAnswer: "On this account, wrongness is comparative: an action is wrong when it is the least good of the options actually available to the agent. This implies a wrong act can still be good in absolute terms — if all your options are good but you pick the one that does the least good, your choice is wrong even though it is a good thing. Wrongness here measures the shortfall relative to better available options, not absolute badness. So 'wrong' marks a failure to do as well as one could, not necessarily the doing of something bad.", explanation: "Full credit: explains comparative wrongness and the consequence that a wrong act may still be good." },
      { topicSlug: "wrong-least-good", prompt: "You can save ten people or, with the same effort, only two, and you choose to save only two. Explain why saving the two is both a good act and a wrong one, and what this reveals about how we judge actions. (3–5 sentences.)", correctAnswer: "Saving the two is a good act because rescuing people is genuinely good and you did real good. It is nonetheless wrong, because a far better option was equally available — saving ten — and you chose the option that did less good for no justifying reason. This reveals that we judge an action partly against the alternatives the agent could have taken, not in isolation. An act can therefore earn the verdict 'wrong' precisely because something much better was within reach.", explanation: "Full credit: identifies the act as good yet wrong by comparison to the better available option, and draws the lesson about comparative judgment." },
      { topicSlug: "ought-implies-can", prompt: "State and explain the principle 'ought implies can,' and give an example showing why an apparent obligation dissolves when the action becomes genuinely impossible. (3–5 sentences.)", correctAnswer: "The principle 'ought implies can' says that one can be obligated to do only what one is actually able to do; if an act is genuinely impossible for you, you cannot be under a duty to perform it. For example, if you promised to meet a friend but are then physically trapped by a flood with no way to reach them, your obligation to show up dissolves, because keeping it has become impossible. It would be incoherent to blame someone for failing to do what they could not possibly have done. So genuine impossibility removes the obligation rather than leaving it merely unmet.", explanation: "Full credit: states the principle, explains the rationale (no duty to the impossible), and gives a valid impossibility example." },
      { topicSlug: "legality-morality", prompt: "Explain why legality and morality are not the same thing, giving one case where a legal act is immoral and one where an illegal act is moral. (3–5 sentences.)", correctAnswer: "Legality concerns what the law of a given time and place permits or forbids, while morality concerns what is actually right or wrong, so the two can come apart. A legal act can be immoral — for instance, exploiting a legal loophole to abandon dependents one is responsible for. An illegal act can be moral — for instance, defying an unjust law in order to protect innocent people from persecution. Because laws are human creations that can themselves be unjust, conformity to law is neither necessary nor sufficient for acting rightly.", explanation: "Full credit: separates legality from morality and supplies a legal-but-immoral and an illegal-but-moral case." },
    ],
  },
  {
    kind: "midterm",
    title: "Midterm — Units 1 & 2",
    weekNumber: 2,
    isTimed: true,
    timeLimitMinutes: 60,
    instructions: "Cumulative midterm covering Units 1–2. 60 minutes. Answer each question in a short paragraph (about 4–6 sentences) in your own words. Pasting disabled; keystrokes screened.",
    problems: [
      { topicSlug: "what-is-ethics", prompt: "Explain what ethics, as a discipline, is trying to accomplish, and why analyzing our normative concepts (like 'good,' 'right,' and 'ought') is central to that project. (4–6 sentences.)", correctAnswer: "Ethics tries to work out what is genuinely good, right, and obligatory, and to give reasoned justifications rather than mere opinions. Doing this requires analyzing our normative concepts, because claims like 'that was wrong' or 'you ought to help' can only be assessed once we are clear on what 'wrong' and 'ought' actually demand. Clarifying the conditions something must meet to count as good or right lets us test particular judgments for consistency and truth. Without that conceptual analysis, moral disputes collapse into people talking past one another. So conceptual clarity is the foundation on which substantive ethical conclusions are built.", explanation: "Full credit: describes ethics' normative aim and explains why analyzing normative concepts is central to it." },
      { topicSlug: "instrumental-intrinsic", prompt: "Can a single thing be both instrumentally and intrinsically good? Defend your answer with an example, and explain why ethics cares chiefly about intrinsic value. (4–6 sentences.)", correctAnswer: "Yes, one thing can have both kinds of value. Intelligence, for example, is instrumentally good because it helps us solve problems and reach our goals, and plausibly intrinsically good because a developed mind is worth having for its own sake. Ethics cares chiefly about intrinsic value because instrumental value is always derivative — a means is only as good as the end it serves — so unless some things are good in themselves there would be nothing for instrumental goods to be good for. Identifying what is intrinsically valuable therefore anchors all our other evaluations.", explanation: "Full credit: answers 'yes' with a dual-value example and explains ethics' focus on intrinsic value." },
      { topicSlug: "non-privative", prompt: "Explain why a mere rock is not 'bad,' even though it lacks all the good qualities a virtuous person has. Use this to explain why badness is a positive rather than a privative property. (4–6 sentences.)", correctAnswer: "A rock lacks kindness, courage, and every virtue, yet we don't call it bad, because badness is not simply the absence of good qualities. To be bad, something must possess something further — ill will, cruelty, or the active infliction of harm — which a rock cannot have. This shows badness is a positive property: it is the presence of something objectionable, not a mere gap where goodness might have been. If badness were privative, every inanimate object lacking virtue would count as evil, which is absurd.", explanation: "Full credit: uses the rock to show mere absence of good isn't badness and concludes badness is positive." },
      { topicSlug: "weight-of-obligations", prompt: "Rank these by their typical moral weight and justify your ranking: keeping a casual lunch date; a paid teacher's duty to teach their students well; a head of state's duty to protect their people. (4–6 sentences.)", correctAnswer: "From weakest to strongest, the ranking is the casual lunch date, then the teacher's duty, then the head of state's duty. The lunch date involves low stakes and easily repaired disappointment, so it is the least weighty. The teacher's duty is heavier because students depend on it for their education and the teacher has accepted payment and trust to provide it. The head of state's duty is weightiest because it affects the safety and welfare of an entire population, with the gravest consequences if neglected. In general, weight rises with the stakes, the vulnerability of those affected, and the trust reposed in the agent.", explanation: "Full credit: orders lunch < teacher < head of state and justifies via stakes/dependence/trust." },
      { topicSlug: "outweigh-vs-cancel", prompt: "Suppose you must break a promise to a friend in order to meet a far weightier obligation. Explain why you still owe the friend something afterward, and what this shows about outweighed obligations. (4–6 sentences.)", correctAnswer: "Even though the weightier obligation justified breaking the promise, you still owe the friend an explanation, an apology, or some attempt to make up for it. That residual debt would make no sense if the promise had simply been cancelled by the conflict; you only owe amends because the original obligation was real and remained in force. This shows that being outweighed is not the same as being erased — an overridden obligation persists as a moral residue. The lesson is that even justified breaches leave moral traces the agent must address.", explanation: "Full credit: identifies the residual duty and uses it to distinguish outweighing from cancelling." },
      { topicSlug: "right-least-bad", prompt: "Explain why 'right' is not the same as 'good,' using the idea that the right act is the least bad available option. Give an example of a right act that is nonetheless bad. (4–6 sentences.)", correctAnswer: "'Right' is comparative — the right act is the least bad of the options actually available — whereas 'good' is a property an act can have in itself. Because of this, the right act need not be good: in a tragic situation where every option harms someone, the least harmful choice is right yet still bad. For example, a doctor with one dose of medicine and two dying patients does right by saving whoever can be saved, but the outcome in which the other dies remains bad. So rightness measures relative standing among options, not absolute goodness.", explanation: "Full credit: explains comparative rightness vs. absolute goodness with a valid forced-choice example." },
      { topicSlug: "ought-implies-can", prompt: "Explain why 'ought implies can' holds for each individual obligation, even in a situation where two obligations conflict and cannot both be met. (4–6 sentences.)", correctAnswer: "'Ought implies can' applies to each obligation taken on its own: for any single duty, you can be bound by it only if fulfilling that duty is possible for you. In a conflict, each of the two obligations is individually possible to perform — you could do either one — so each genuinely binds you, and the principle is satisfied for both. What is impossible is performing both at once, but that is a fact about the pair, not about either duty singly. So the principle is preserved even though the full set of obligations cannot be jointly satisfied.", explanation: "Full credit: distinguishes individual satisfiability (each possible) from joint satisfiability (both impossible together)." },
      { topicSlug: "legality-morality", prompt: "Argue, with examples, that legality is neither necessary nor sufficient for morality. (4–6 sentences.)", correctAnswer: "Legality is not sufficient for morality because some legal acts are clearly immoral — laws have permitted, and even mandated, grave injustices, yet their legality did not make them right. Legality is not necessary for morality because some illegal acts are clearly moral — defying an unjust law to shelter the persecuted can be exactly the right thing to do despite being against the law. These cases work because law is a human institution that can itself be unjust, so conformity to it does not track moral truth. Hence we must judge laws by morality, not the reverse.", explanation: "Full credit: gives a legal-but-immoral case and an illegal-but-moral case and explains why law can diverge from morality." },
    ],
  },

  // Unit 3
  {
    kind: "homework",
    title: "Homework 3.1 — Judgment, act, and agent",
    weekNumber: 3,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 3–5 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "judging-vs-status", prompt: "A jury is convinced of a defendant's guilt only on a hunch, without sufficient evidence — and the defendant happens to be guilty. Explain why convicting would still be wrong, and what this shows about the difference between a verdict being correct and someone having the right to assert it. (3–5 sentences.)", correctAnswer: "Convicting would be wrong because a jury is only entitled to convict when it has sufficient evidence of guilt, and a mere hunch does not meet that standard, even if the hunch happens to be correct. The defendant's actual guilt is one thing; the jury's epistemic right to declare it is another, and the latter requires adequate grounds. This shows that the correctness of a judgment and one's entitlement to make it can come apart: you can be right by luck while still having no right to assert it. Responsible judgment is governed by evidence, not by whether you happen to land on the truth.", explanation: "Full credit: explains the conviction is illegitimate for lack of evidence and distinguishes the truth of a claim from entitlement to assert it." },
      { topicSlug: "judging-vs-status", prompt: "Explain how it can be condemnable to condemn an act that really is wrong. What condition makes the condemning itself blameworthy? (3–5 sentences.)", correctAnswer: "It can be condemnable to condemn a genuinely wrong act when the person doing the condemning lacks sufficient evidence that the act was wrong. In that case, even though their verdict happens to be correct, they reached it irresponsibly — accusing without warrant — and accusing people without adequate grounds is itself a moral failing. The wrongness of the original act does not retroactively justify a reckless accusation. So the condition that makes the condemning blameworthy is the condemner's lack of justification, not the truth of the charge.", explanation: "Full credit: identifies insufficient evidence as the condition making the condemnation blameworthy despite the target being guilty." },
      { topicSlug: "act-vs-agent", prompt: "Two people act on identical, well-formed good intentions; one succeeds and one causes a tragedy because of information she had no way to obtain. Explain why she is not more blameworthy than the other, and what this shows about the basis of praise and blame. (3–5 sentences.)", correctAnswer: "She is not more blameworthy because praise and blame attach to the agent's intentions and the quality of her reasoning, not to outcomes she could not foresee or control. Both agents willed the same good thing and deliberated equally well; the only difference is luck in how things turned out, which is not something either chose. Holding her more responsible would be punishing her for bad luck rather than for any failing of will. This shows that the moral assessment of an agent tracks intention and diligence, not results.", explanation: "Full credit: grounds blame in intention/reasoning rather than unforeseeable outcome (rejecting moral luck)." },
      { topicSlug: "act-vs-agent", prompt: "A person tries hard to kill innocent victims, but by sheer luck they survive and even flourish. Explain why she still deserves no praise, and how this case complements the previous one about good intentions and bad luck. (3–5 sentences.)", correctAnswer: "She deserves no praise because her intention was murderous; the victims' survival was a matter of luck, not of anything good she willed or did. Just as bad luck should not increase the blame of someone with good intentions, good luck should not earn praise for someone with evil intentions. Both cases point to the same principle: moral credit and discredit track what the agent intended and tried to do, not the outcome chance delivered. The lucky good result no more redeems her than the unlucky bad result condemned the well-meaning agent.", explanation: "Full credit: denies praise because the intention was evil and connects the symmetry: outcomes from luck don't change desert." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 3.2 — Attempts, intentions, and the self",
    weekNumber: 3,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 3–5 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "intention-attempts", prompt: "Legal systems often punish a failed attempt less harshly than a completed crime. Explain a plausible moral rationale for this, and then explain why it is at least debatable whether the attempter is really less blameworthy. (3–5 sentences.)", correctAnswer: "One rationale is evidentiary: failure can suggest a weaker or more conflicted intention, so the failed attempt is treated as weaker evidence of a fully resolute criminal will, and the completed crime also produced actual harm. On this view we punish the completed crime more because success signals firmer intent and caused real damage. But it is debatable, because an attempter who did everything in their power and failed only by luck seems to have exactly the evil will of the successful criminal, and luck should not reduce blame. So the leniency may track outcome and evidence more than the agent's actual culpability.", explanation: "Full credit: gives the weaker-intention/harm rationale AND notes the moral-luck objection that the lucky failure may be equally culpable." },
      { topicSlug: "hitler-problem", prompt: "Someone insists a notorious wrongdoer 'meant well,' citing his sincere-sounding speeches. Explain why public declarations of good intention don't settle what a person actually intended, and how intentions should instead be assessed. (3–5 sentences.)", correctAnswer: "Declarations of good intention don't settle anything because people can lie about, or be self-deceived about, their own motives, and stated intentions are cheap. What a person actually intended is shown by the whole pattern of their conduct — what they knowingly chose, pursued, and brought about over time. When someone's sustained actions consist in deliberately inflicting massive harm, that conduct outweighs any contrary speeches and reveals the real intention. So intentions are inferred from what an agent reliably does, not from what they announce.", explanation: "Full credit: explains that stated intentions are unreliable and that real intention is read from sustained conduct." },
      { topicSlug: "immorality-toward-self", prompt: "Does acting from firm principles guarantee that one is acting morally? Defend your answer and explain what else is required. (3–5 sentences.)", correctAnswer: "No, acting from firm principles does not guarantee moral action, because the principles themselves can be bad ones. A committed fanatic may act with perfect consistency on a principle that is cruel or unjust, and his steadfastness only makes the wrongdoing more reliable. What is additionally required is that the principles be correct — that they track what is actually good and right — not merely sincerely held. So conscientiousness is no substitute for having the right values.", explanation: "Full credit: answers 'no' because principles can be bad, and adds that the principles must be correct, not just firmly held." },
      { topicSlug: "self-harm-autonomy", prompt: "Give a reasoned account of why we generally don't punish purely self-destructive behavior, and explain why this restraint does not amount to saying such behavior is morally fine. (3–5 sentences.)", correctAnswer: "We generally don't punish purely self-regarding self-destructive behavior partly because it already carries its own costs and partly out of respect for the person's autonomy over their own life. Punishing someone for harming only themselves would add gratuitous suffering and would override their authority to make their own choices. But declining to punish is not the same as endorsing: an act can be unwise or even wrong while still not being a proper target of punishment. So the restraint reflects limits on punishment, not a verdict that the conduct is good.", explanation: "Full credit: gives an autonomy/self-punishing rationale and separates non-punishment from moral approval." },
    ],
  },
  {
    kind: "test",
    title: "Unit 3 Test — Acts, Agents, and Judgment",
    weekNumber: 3,
    isTimed: true,
    timeLimitMinutes: 40,
    instructions: "Timed. 40 minutes. Answer each question in a short paragraph (about 4–6 sentences) in your own words. Pasting disabled; keystrokes screened.",
    problems: [
      { topicSlug: "judging-vs-status", prompt: "Explain why the moral status of judging an act can differ from the moral status of the act being judged. Illustrate with a case where someone reaches a true verdict but should not have asserted it. (4–6 sentences.)", correctAnswer: "The act being judged has whatever moral status it has independently of who evaluates it, but the act of judging is itself conduct that can be done responsibly or irresponsibly. Judging well requires sufficient evidence, so one can be blameworthy for asserting a verdict without adequate grounds even when the verdict is true. For example, a gossip who declares a colleague a thief on no real evidence speaks irresponsibly even if the colleague turns out to be guilty. The truth of the charge does not license the reckless way it was made. So evaluating an act and being entitled to evaluate it are distinct moral questions.", explanation: "Full credit: distinguishes status-of-act from status-of-judging, ties entitlement to evidence, and gives a true-but-unwarranted example." },
      { topicSlug: "act-vs-agent", prompt: "Does an agent's praise- or blameworthiness depend on the outcome of their action or on their intention? Defend your answer against the objection from cases where good intentions lead to disaster. (4–6 sentences.)", correctAnswer: "An agent's praise- or blameworthiness depends on intention and the quality of deliberation, not on the outcome, because outcomes are often governed by luck the agent cannot control. The objection notes that good intentions sometimes lead to disaster, but in such cases we should distinguish regret about the outcome from blame of the agent: a conscientious agent who could not have foreseen the harm is not culpable for it. We may still hold someone responsible if the bad outcome flowed from negligence, but then it is the faulty intention or carelessness, not the bad luck, that grounds blame. So properly understood, the disaster cases do not undermine the intention-based view.", explanation: "Full credit: defends intention-based desert and handles the bad-outcome objection by separating luck from negligence." },
      { topicSlug: "intention-attempts", prompt: "Is an agent's praiseworthiness determined by whether the action succeeds, or by something else? Explain, and say what role success actually plays in our judgments. (4–6 sentences.)", correctAnswer: "Praiseworthiness is determined by the agent's intention and effort, not by whether the action happens to succeed, since success often depends on factors outside the agent's control. Two agents with identical good intentions and equal diligence are equally praiseworthy even if only one succeeds. Success still plays a role, but an evidential one: it is often a clue to how serious or competent the underlying intention was, which is why we sometimes read outcomes back as evidence about the will. The outcome matters as a sign of intention, not as the thing that confers moral credit.", explanation: "Full credit: locates desert in intention and assigns success an evidential (not constitutive) role." },
      { topicSlug: "hitler-problem", prompt: "Someone defends a notorious mass murderer by claiming he 'meant well.' Give the strongest reply, explaining how we can know what a person's real intentions were. (4–6 sentences.)", correctAnswer: "The strongest reply is that his sustained conduct — the deliberate, large-scale infliction of harm — shows that doing good was not in fact his intention, and that whatever good he may have professed was overwhelmed by his evident evil aims. We know a person's real intentions not from their self-flattering claims but from the pattern of what they knowingly and repeatedly chose to do. When someone's reliable course of action is to cause atrocity, that conduct is decisive evidence of intention and cannot be offset by speeches. So the 'meant well' defense fails on the very evidence it tries to ignore.", explanation: "Full credit: replies that conduct reveals intention and that professed good intent is outweighed/contradicted by the pattern of action." },
      { topicSlug: "self-harm-autonomy", prompt: "Does the fact that we typically refrain from punishing self-harm show that self-harm is morally permissible? Defend your answer. (4–6 sentences.)", correctAnswer: "No, the refusal to punish self-harm does not show it is permissible, because whether an act deserves punishment is a separate question from whether it is right. We refrain from punishing purely self-regarding harm out of respect for autonomy and because it already carries its own costs, not because we have judged it good. An act can be unwise, self-destructive, or even wrong while still being something the state and others should not punish. So non-punishment reflects the limits of legitimate interference, not moral approval.", explanation: "Full credit: answers 'no' and separates desert of punishment from moral permissibility, citing autonomy." },
    ],
  },

  // Unit 4
  {
    kind: "homework",
    title: "Homework 4.1 — Is/ought, Moore, and entailment",
    weekNumber: 4,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 4–6 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "ought-from-is", prompt: "Suppose someone defines 'a good act' as 'an act that maximizes happiness.' Explain whether, on that definition, an 'ought' could be derived from purely factual ('is') premises, and what this shows about the supposed unbridgeable gap between facts and values. (4–6 sentences.)", correctAnswer: "On that definition, an 'ought' can be derived from 'is' premises: if 'good' just means 'maximizes happiness,' then the factual claim that a given act maximizes happiness entails that the act is good and so ought to be done. The derivation goes through only because a bridging definition links the evaluative term to the factual one. This shows the is–ought gap is not absolute: once an evaluative concept is given factual content, factual premises can yield normative conclusions. The real dispute, then, is over whether such definitions of moral terms are correct, not over logic itself.", explanation: "Full credit: explains the entailment works given the definition and that the gap depends on a definitional bridge, not pure logic." },
      { topicSlug: "open-question", prompt: "State the conclusion Moore tries to establish with his open-question argument, and briefly explain the reasoning he uses to get there. (4–6 sentences.)", correctAnswer: "Moore's conclusion is that goodness is not identical to or definable in terms of any natural or factual property — ethical truths are not reducible to factual statements. His reasoning is that for any proposed factual definition of 'good' (say, 'good = pleasant'), it always remains an intelligible, 'open' question whether something with that property is really good. If the definition were correct, he argues, the question would be closed and trivial, like asking whether a bachelor is unmarried. Since the question stays open, he concludes the proposed identity fails, and generalizes that no such reduction can succeed.", explanation: "Full credit: states the non-reducibility conclusion and reconstructs the open-question reasoning." },
      { topicSlug: "open-question", prompt: "Explain the strongest objection to Moore's open-question argument. Why might a question seem 'open' even when a correct definition is available? (4–6 sentences.)", correctAnswer: "The strongest objection is that a question can seem open even when a correct analysis exists, so openness does not prove non-identity. Competent speakers can fail to recognize a true definition — the question 'is water H2O?' once seemed open, yet water just is H2O — because grasping a term doesn't guarantee knowing its correct analysis. Likewise, enough factual information may in fact close the question of whether something is good, even if it doesn't feel trivially closed to us. So the apparent openness reflects our conceptual limitations, not a real gap between goodness and factual properties.", explanation: "Full credit: objection that seeming-openness is not non-identity, with an analogy (water/H2O) showing analyses can be informative." },
      { topicSlug: "entailment-ampliative", prompt: "Is deductive entailment 'ampliative' — can it genuinely extend our knowledge — or does it only restate what we already know? Defend your answer with an example. (4–6 sentences.)", correctAnswer: "Deductive entailment is ampliative in the sense that it can genuinely extend our knowledge, even though the conclusion is contained in the premises. From a handful of simple axioms, mathematicians deduce surprising and hard-won theorems that no one knew merely by accepting the axioms — proving them required real intellectual work and yielded new knowledge. The information may be implicit in the premises, but making it explicit is a genuine cognitive achievement, not a trivial restatement. So deduction does not merely repeat what we already knew; it can teach us things we did not know we were committed to.", explanation: "Full credit: argues deduction yields new knowledge (implicit to explicit) with a mathematics/theorem example." },
    ],
  },
  {
    kind: "homework",
    title: "Homework 4.2 — Genetic fallacy, use, and realism",
    weekNumber: 4,
    isTimed: false,
    timeLimitMinutes: null,
    instructions: "Untimed practice. Answer each question in a short paragraph (about 4–6 sentences) in your own words; one-word answers will not receive credit.",
    problems: [
      { topicSlug: "genetic-vs-normative", prompt: "Explain the genetic fallacy and why the origin of a belief is irrelevant to its truth. Give an example of the fallacy and one case where origin is legitimately relevant to something other than truth. (4–6 sentences.)", correctAnswer: "The genetic fallacy is the mistake of judging a belief true or false based on where it came from rather than on the evidence for it. Origin is irrelevant to truth because how someone arrived at a claim has no bearing on whether the claim corresponds to reality — a true statement reached by a bad route is still true. For example, dismissing a scientific theory merely because its proponent had selfish motives is fallacious. Origin can still be relevant to other questions, though: a source's track record bears on how much to trust a claim before we can check it ourselves, which concerns credibility, not truth.", explanation: "Full credit: defines the fallacy, explains origin is not truth with an example, and distinguishes a legitimate use of origin (credibility)." },
      { topicSlug: "truth-vs-use", prompt: "Some argue that because many claims paraded as 'moral truths' have been false or self-serving, there are no moral truths at all. Explain why this inference is flawed, using a parallel from another domain. (4–6 sentences.)", correctAnswer: "The inference is flawed because the existence of false or corrupt claims in a domain does not show the domain has no truths. Many proposed scientific 'laws' have turned out false or were pushed for self-serving reasons, yet no one concludes there are no real laws of nature — we conclude only that some claimants were wrong. The same holds for morality: that people have abused moral language or gotten moral questions wrong shows fallibility, not the absence of moral truth. Misuse of a concept is evidence about its users, not about whether the concept has correct applications.", explanation: "Full credit: separates misuse/falsity of some claims from non-existence of truths, with a parallel (science/laws)." },
      { topicSlug: "truth-vs-use", prompt: "Someone argues that because a moral principle was only widely implemented late in history, it must have been invented at that point rather than discovered. Explain what is wrong with this reasoning. (4–6 sentences.)", correctAnswer: "The reasoning confuses the late implementation of a principle with its origination, but discovering or finally acting on a truth is not the same as inventing it. Arithmetic truths held before anyone built a calculator and were discovered, not created, when people came to grasp them; likewise a moral principle can be true all along and only later be recognized and put into practice. The timing of social adoption tells us about human progress in recognizing a truth, not about when the truth came into being. So delayed implementation is fully compatible with the principle's having been true and discoverable all along.", explanation: "Full credit: distinguishes discovery/implementation from invention with the arithmetic-before-calculators parallel." },
      { topicSlug: "reject-realism", prompt: "Does the existence of widespread moral disagreement prove that there is no objective moral truth? Defend your answer, addressing what disagreement does and does not establish. (4–6 sentences.)", correctAnswer: "No, moral disagreement does not prove there is no objective moral truth, because disagreement also occurs about plainly factual matters without showing those matters lack a truth. People have disagreed sharply about the age of the universe or the cause of a disease, yet there is a fact of the matter in each case; persistent dispute reflects differences in evidence, reasoning, and bias, not the absence of truth. At most, moral disagreement shows that moral questions are hard and that people are fallible. To get from disagreement to anti-realism, one would need to show the disagreements are in principle unresolvable by reasons, which mere disagreement does not establish.", explanation: "Full credit: answers 'no,' notes factual domains have disagreement too, and identifies what would actually be needed for the anti-realist conclusion." },
    ],
  },
  {
    kind: "final",
    title: "Final Exam — All units",
    weekNumber: 4,
    isTimed: true,
    timeLimitMinutes: 90,
    instructions: "Cumulative final covering Units 1–4. 90 minutes. Answer each question in a short paragraph (about 4–6 sentences) in your own words. Pasting disabled; keystrokes screened.",
    problems: [
      { topicSlug: "instrumental-intrinsic", prompt: "Explain which kind of goodness — instrumental or intrinsic — is the ultimate concern of ethics, and why the other kind is derivative. Use an example. (4–6 sentences.)", correctAnswer: "Ethics is ultimately concerned with intrinsic goodness — what is good in itself — because instrumental goodness is derivative: a means is valuable only relative to the end it serves. Money, for instance, is instrumentally good because of what it can buy, but it has no value on its own; its worth borrows entirely from the genuinely valuable ends it helps secure. If nothing were good in itself, there would be no ends to ground the value of any means, and the whole structure of value would collapse. So intrinsic value is fundamental and instrumental value depends on it.", explanation: "Full credit: identifies intrinsic value as ethics' ultimate concern and explains instrumental value's dependence, with an example." },
      { topicSlug: "non-privative", prompt: "Explain why 'condemnable' is not merely the absence of 'commendable,' and how this makes it possible for one act to be both commendable and condemnable. (4–6 sentences.)", correctAnswer: "'Condemnable' is not merely the absence of 'commendable' because each is a positive property grounded in real features of an act, not in the lack of the other. An act is commendable in virtue of something praiseworthy in it and condemnable in virtue of something blameworthy in it, and these can be different aspects of the same act. Because both are genuine presences rather than mere absences, a single act can possess both at once — for instance, a brave rescue carried out with needless cruelty. If 'condemnable' just meant 'not commendable,' such mixed acts would be impossible, since nothing can both have and lack one property.", explanation: "Full credit: argues both are positive properties and explains how that permits one act to be both." },
      { topicSlug: "right-least-bad", prompt: "Explain what makes an action the 'right' one to take, and why, on this account, the right action can sometimes be a bad thing to do. (4–6 sentences.)", correctAnswer: "The right action is the least bad of the options genuinely available to the agent in the circumstances, so rightness is comparative rather than absolute. Because of this, the right action can still be a bad thing: when every available option causes harm, the least harmful one is right yet remains regrettable in itself. Choosing it is doing the best one can, not doing something good. So 'right' picks out the best available option, which in a tragic situation may still be bad.", explanation: "Full credit: defines right as least-bad-available and explains the right act can be bad in absolute terms." },
      { topicSlug: "wrong-least-good", prompt: "Explain what makes an action 'wrong,' and why a wrong action can nevertheless be a good one. (4–6 sentences.)", correctAnswer: "An action is wrong when it is the least good of the options actually available to the agent, so wrongness, like rightness, is comparative. This means a wrong action can still be good in absolute terms: if all your options are good but you choose the one that does the least good, your choice is wrong even though it does real good. Wrongness here marks a failure to do as well as you could, given better options within reach. So calling an act wrong is compatible with its being, in itself, a good thing.", explanation: "Full credit: defines wrong as least-good-available and explains a wrong act can still be good." },
      { topicSlug: "outweigh-vs-cancel", prompt: "Explain why an obligation that is outweighed by a stronger one is not thereby erased, and describe the moral evidence that shows it still exists. (4–6 sentences.)", correctAnswer: "An outweighed obligation is overridden, not erased, because being defeated in a particular conflict is different from making no claim at all. The evidence is moral residue: after justifiably breaking a lesser duty to meet a greater one, you still owe an apology, explanation, or amends, which only makes sense if the lesser duty remained real. If the obligation had simply vanished, there would be nothing left to make up for. The persistence of these residual demands shows the original obligation survived the conflict.", explanation: "Full credit: distinguishes overriding from erasing and cites residual duties as evidence of persistence." },
      { topicSlug: "act-vs-agent", prompt: "One person intends evil but produces good by luck; another intends good but produces harm by bad luck. Explain who, if either, deserves condemnation, and justify the principle behind your verdict. (4–6 sentences.)", correctAnswer: "The one who intended evil deserves condemnation, and the one who intended good does not, because the moral assessment of agents tracks their intentions and deliberation rather than the outcomes luck delivers. The first agent willed something wicked and is culpable even though chance produced a good result; the second willed something good and reasoned well, so the unlucky harm is not a moral failing of hers. Letting luck decide desert would mean praising and blaming people for things outside their control, which is unjust. So intention, not outcome, is the proper basis of condemnation.", explanation: "Full credit: condemns the evil-intending agent, exonerates the good-intending one, and justifies via intention-based desert (rejecting moral luck)." },
      { topicSlug: "judging-vs-status", prompt: "Explain how it can be condemnable to condemn an act that really is condemnable. What does this reveal about the ethics of judgment? (4–6 sentences.)", correctAnswer: "It can be condemnable to condemn a genuinely condemnable act when the condemner lacks sufficient evidence that the act was wrong, because issuing a verdict without adequate grounds is itself irresponsible. In that case the condemner happens to be right, but only by luck, and accusing people without warrant is a moral failing regardless of whether the accusation lands. This reveals that judgment is itself a kind of conduct governed by epistemic responsibility: having the right to assert a verdict depends on one's evidence, not merely on the verdict's truth. Ethical judging therefore requires justification, not just correctness.", explanation: "Full credit: identifies lack of evidence as what makes the condemnation blameworthy and draws the lesson about responsible judgment." },
      { topicSlug: "open-question", prompt: "Explain Moore's open-question argument and then give the strongest objection to it. (4–6 sentences.)", correctAnswer: "Moore's open-question argument holds that for any proposed factual definition of 'good' — such as 'good = what we desire to desire' — it remains an intelligible, open question whether something with that property is really good; from this he concludes goodness is not reducible to any factual property. The strongest objection is that a question can seem open even when a correct definition exists, so apparent openness does not prove non-identity. The identity 'water = H2O' was informative and once seemed open, yet it is true; grasping a concept does not guarantee knowing its correct analysis. So enough factual information may close the question of goodness even when it doesn't feel closed, undermining Moore's inference.", explanation: "Full credit: reconstructs the argument and gives the seeming-openness objection with a supporting analogy." },
      { topicSlug: "genetic-vs-normative", prompt: "Explain why discovering that a belief has a disreputable origin does not show the belief is false, and name the fallacy committed by those who think it does. (4–6 sentences.)", correctAnswer: "Discovering a disreputable origin does not show a belief is false because the truth of a belief depends on whether it corresponds to reality, not on the route by which someone came to hold it. A claim can be reached through bias, bad motives, or luck and still be true, just as a claim reached through impeccable reasoning can be false. Inferring falsity from a tainted origin is the genetic fallacy: it confuses a question about origins with a question about truth. To assess the belief properly, one must examine the evidence for it, not its pedigree.", explanation: "Full credit: explains origin is not truth and names the genetic fallacy." },
      { topicSlug: "disagreement-fact-value", prompt: "Explain how we can tell whether a dispute is a genuine disagreement about objective truth rather than a mere clash of tastes. Apply your test to a moral dispute and to a difference in flavor preference. (4–6 sentences.)", correctAnswer: "The test is whether reasons and evidence can rationally bear on the dispute: if the parties can offer considerations that ought to move a reasonable person toward one side, the dispute concerns objective truth, whereas if nothing could count as a reason for either side, it is a mere clash of taste. A moral dispute — say, over whether exploiting vulnerable people is wrong — passes the test, because arguments about harm, fairness, and consistency are genuinely relevant and one side can be shown to be mistaken. A difference over whether one prefers one ice-cream flavor to another fails the test, since there is nothing to argue about; each person is simply reporting a preference. So rational debatability marks the line between objective disagreement and mere taste.", explanation: "Full credit: states the rational-debatability test and applies it to a moral case (truth-apt) and a flavor case (mere taste)." },
    ],
  },
];

// ---------------------------------------------------------------------------
// "Teaching to the test" primers — concise lecture material that prepares
// students for the two embedded diagnostic instruments (Ethical Reasoning and
// Critical Reasoning). Seeded idempotently by slug so they are added to both
// fresh and already-populated databases without wiping student progress.
// ---------------------------------------------------------------------------

const REASONING_PRIMERS: SeedTopic[] = [
  {
    slug: "reasoning-primer-ethical",
    title: "How to reason about moral dilemmas",
    weekNumber: 1,
    blurb:
      "Assessment primer: weighing considerations and reasoning beyond convention.",
    lectureTitle: "Primer: How to reason about moral dilemmas",
    body: `# How to reason about moral dilemmas

This short primer prepares you for the **Ethical Reasoning** diagnostic. That instrument does not ask for the "right" answer — it asks *which considerations you give weight to* when you decide. Here is the method it rewards.

## A dilemma is a clash of considerations

A genuine moral dilemma is a situation where several real considerations pull in different directions: a promise made, a harm threatened, a fair procedure, a person's wellbeing. Reasoning well does not mean ignoring the considerations you act against — it means being honest that they had weight, and saying why other considerations outweighed them. (Recall from Unit 2 that **outweighing is not canceling**: a reason you act against still counted.)

## Three levels of consideration

When you justify a decision, the *kind* of reason you appeal to matters:

- **Personal-interest reasons** — what is easiest, safest, or most rewarding *for the decider*. ("It would be awkward to report it.")
- **Maintaining-norms reasons** — what the rules, the law, or one's role formally require. ("Company policy says to.") These keep order, but a rule can itself be unjust.
- **Principle-based reasons** — appeals to rights, fairness, and the impartial good of *everyone affected*, justifiable to any reasonable person. ("Each person affected deserves an explanation they could accept.")

The diagnostic's **principled-reasoning index** rises when you give the most weight to principle-based considerations rather than to convenience or to "because that's the rule."

## How to take the instrument well

1. **Decide the action** the person should take.
2. **Rate every consideration** by how much it actually weighed on you — be honest, not strategic.
3. **Rank your top few.** Ranking is where you say what *most* drove the decision.
4. **Read each consideration carefully.** Some are deliberately hollow or jargon-filled and reward nothing; ranking one high is a reliability flag.

There is no penalty for the action you choose. What is measured is the *quality of the reasons* you stand behind.`,
  },
  {
    slug: "reasoning-primer-critical",
    title: "Core critical-thinking skills",
    weekNumber: 1,
    blurb:
      "Assessment primer: analysis, inference, evaluation, deduction, and induction.",
    lectureTitle: "Primer: Core critical-thinking skills",
    body: `# Core critical-thinking skills

This short primer prepares you for the **Critical Reasoning** diagnostic — a set of multiple-choice items that test five distinct reasoning skills. Knowing what each skill *is* helps you see what a question is really asking.

## The five skills

- **Analysis** — break an argument into parts: identify its **conclusion**, its stated **premises**, and any **unstated assumption** it depends on. Ask: "What is this arguing *for*, and what does it take for granted?"
- **Inference** — work out what *follows* from given information, and how strongly. Distinguish what must be true, what is likely, and what is merely possible.
- **Evaluation** — judge how much support the reasons actually give the conclusion. Spot when evidence is irrelevant, a source is unreliable, or a step does not connect.
- **Deduction** — reason where a true set of premises *guarantees* the conclusion. In a valid deduction, the conclusion cannot be false if the premises are true. Watch for invalid forms (e.g. affirming the consequent).
- **Induction** — reason from evidence or examples to a *probable* generalization or prediction. Good induction has a large, representative sample; weak induction over-generalizes from too little.

## A recurring trap: stated vs. assumed vs. plausible

Most wrong answers are statements that are *plausible* or *true in the real world* but are **not actually supported by the argument given**. The discipline this instrument rewards is the one from Unit 1: keep apart what is **stated**, what is **assumed**, and what only *sounds* reasonable. A strong answer follows from the reasons on the page — nothing more.

## How to take the instrument well

1. Find the **conclusion** first, then the premises.
2. Ask which of the five skills the question targets (an assumption question is analysis; a "what follows" question is inference or deduction; a "how good is this reasoning" question is evaluation).
3. Choose the option that follows **only** from what is given — not the one that is merely true or appealing.`,
  },
];

// Insert any teaching-to-the-test primer lectures whose slug is not yet present.
// Safe to run on every boot: it only adds what is missing.
export async function seedReasoningPrimersIfMissing(): Promise<void> {
  let added = 0;
  for (let i = 0; i < REASONING_PRIMERS.length; i++) {
    const t = REASONING_PRIMERS[i]!;
    const existing = await db
      .select({ id: topicsTable.id })
      .from(topicsTable)
      .where(eq(topicsTable.slug, t.slug));
    if (existing.length > 0) continue;
    const [inserted] = await db
      .insert(topicsTable)
      .values({
        slug: t.slug,
        title: t.title,
        weekNumber: t.weekNumber,
        blurb: t.blurb,
        position: 900 + i,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert primer ${t.slug}`);
    await db.insert(lecturesTable).values({
      topicId: inserted.id,
      weekNumber: t.weekNumber,
      title: t.lectureTitle,
      body: t.body,
    });
    added += 1;
  }
  if (added > 0) {
    logger.info({ added }, "Reasoning primers seeded");
  } else {
    logger.info("Reasoning primers: already present, skipping");
  }
}

export async function seedIfEmpty(): Promise<void> {
  // The course was migrated from a Quantitative Reasoning syllabus to Ethics.
  // Detect the Ethics marker topic; if present, the content is current and we
  // skip. This makes the seed self-healing across environments: a database that
  // still holds the legacy math curriculum is detected and replaced on boot.
  const ethicsMarker = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-is-ethics"));
  // Read the stored content version. Tolerate the seed_meta table not yet
  // existing (e.g. a boot that races ahead of schema migration): treat that as
  // "no version recorded", which forces a reseed once the table is present.
  let currentVersion: string | null = null;
  try {
    const storedVersion = await db
      .select({ value: seedMetaTable.value })
      .from(seedMetaTable)
      .where(eq(seedMetaTable.key, "content_version"));
    currentVersion = storedVersion[0]?.value ?? null;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Seed: seed_meta unavailable, treating version as unset");
    currentVersion = null;
  }
  if (ethicsMarker.length > 0 && currentVersion === SEED_CONTENT_VERSION) {
    logger.info("Seed: Ethics content present and current, skipping");
    return;
  }
  if (ethicsMarker.length > 0) {
    logger.warn(
      { storedVersion: currentVersion, expected: SEED_CONTENT_VERSION },
      "Seed: Ethics content present but out of date — re-seeding with the current curriculum",
    );
  }

  // No Ethics content. Either the database is empty (fresh) or it still holds
  // the legacy math curriculum. Do the (optional) wipe and the full reseed in a
  // SINGLE transaction so the Ethics marker (slug "what-is-ethics") only ever
  // becomes visible once the entire curriculum has committed. A crash mid-seed
  // rolls back, so the next boot retries instead of leaving partial content
  // that the marker check would wrongly treat as healthy. TRUNCATE also takes
  // an ACCESS EXCLUSIVE lock, so concurrent readers never observe a half-empty
  // course during the replace window.
  await db.transaction(async (tx) => {
    const existing = await tx.execute(sql`select count(*)::int as n from topics`);
    const row = (existing.rows[0] ?? {}) as { n?: number };
    if ((row.n ?? 0) > 0) {
      logger.warn(
        "Seed: stale non-Ethics course content detected — replacing with the Ethics curriculum",
      );
      await tx.execute(
        sql`TRUNCATE TABLE answers, attempts, practice_attempts, practice_problems, practice_sessions, problems, assignments, lectures, topics RESTART IDENTITY CASCADE`,
      );
    } else {
      logger.info("Seed: populating course content");
    }

    // Topics + lectures
    const slugToTopicId = new Map<string, number>();
    for (let i = 0; i < TOPICS.length; i++) {
      const t = TOPICS[i]!;
      const [inserted] = await tx
        .insert(topicsTable)
        .values({
          slug: t.slug,
          title: t.title,
          weekNumber: t.weekNumber,
          blurb: t.blurb,
          position: i,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert topic ${t.slug}`);
      slugToTopicId.set(t.slug, inserted.id);
      await tx.insert(lecturesTable).values({
        topicId: inserted.id,
        weekNumber: t.weekNumber,
        title: t.lectureTitle,
        body: t.body,
      });
    }

    // Assignments + problems
    for (let i = 0; i < ASSIGNMENTS.length; i++) {
      const a = ASSIGNMENTS[i]!;
      const [inserted] = await tx
        .insert(assignmentsTable)
        .values({
          kind: a.kind,
          title: a.title,
          weekNumber: a.weekNumber,
          position: i,
          isTimed: a.isTimed,
          timeLimitMinutes: a.timeLimitMinutes,
          instructions: a.instructions,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert assignment ${a.title}`);
      for (let p = 0; p < a.problems.length; p++) {
        const prob = a.problems[p]!;
        const topicId = slugToTopicId.get(prob.topicSlug);
        if (!topicId) throw new Error(`Unknown topic slug ${prob.topicSlug}`);
        await tx.insert(problemsTable).values({
          assignmentId: inserted.id,
          topicId,
          position: p,
          prompt: prob.prompt,
          correctAnswer: prob.correctAnswer,
          explanation: prob.explanation,
          hint: prob.hint ?? null,
        });
      }
    }

    // Stamp the content version last, inside the same transaction, so the
    // marker check on the next boot only treats the course as "current" once
    // the entire curriculum has committed.
    await tx
      .insert(seedMetaTable)
      .values({ key: "content_version", value: SEED_CONTENT_VERSION })
      .onConflictDoUpdate({
        target: seedMetaTable.key,
        set: { value: SEED_CONTENT_VERSION, updatedAt: new Date() },
      });
  });

  logger.info(
    { topics: TOPICS.length, assignments: ASSIGNMENTS.length, version: SEED_CONTENT_VERSION },
    "Seed complete",
  );
}

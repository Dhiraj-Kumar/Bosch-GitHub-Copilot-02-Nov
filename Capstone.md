## Automotive Industry Use Cases

**1. Vehicle Service Due Predictor**
Log vehicles with their last service date/odometer reading and a service interval policy (e.g. every 10,000 km or 6 months, whichever comes first). The app calculates which vehicles are due or overdue for service, factoring in an estimated daily usage rate to predict the actual calendar date a vehicle will hit its km-based threshold (not just flagging time-based ones). The "whichever comes first" logic plus the usage-rate projection gives Copilot a genuine two-variable decision to reason through rather than a single date comparison — and it's an instantly recognizable fleet-maintenance scenario for an automotive client audience.

**2. Test Drive Slot Scheduler with Vehicle Availability**
A dealership tool: register vehicles in inventory (each with a model and a "currently available" status), and let customers book test drive slots. The system must prevent double-booking the same vehicle in an overlapping time window, and when a requested vehicle/time is unavailable, suggest the next free slot for that same model (not just that exact car) using any other unit of the same model in inventory as a substitute. That substitution logic — falling back to "same model, different unit" — is the interesting design decision worth pairing up to discuss.

**3. Tyre Wear & Rotation Tracker**
Track four tyres per vehicle with installation date and current mileage at each check-in. The app computes estimated remaining life per tyre based on wear rate, flags tyres that need rotation (uneven wear between front/rear or left/right beyond a threshold), and recommends a rotation schedule. This is appealing because "uneven wear detection" forces a real comparison-and-threshold design across four related values instead of one, and it's a maintenance use case that translates cleanly to telematics/IoT data stories your clients care about.

**4. Recall Campaign Coverage Checker — Given, Not Built**
Same "legacy bug hunt" structure as before, but framed in-domain: hand learners an existing small app that matches vehicles (by VIN, model, year) against active recall campaigns and flags which owners need to be notified. Seed it with realistic bugs: a VIN-range boundary check that's off by one, a date comparison that silently fails on a particular date format, a case-sensitivity bug causing model-name mismatches, and a bug where a vehicle that satisfies multiple recalls only gets flagged for one. This is your "reasoning over existing/unfamiliar code" segment, and recall-matching bugs are exactly the kind of subtle real-world defect class automotive engineers will find immediately credible.

**5. Fuel/Charging Cost Comparator for a Mixed Fleet**
For a fleet with both petrol/diesel and EV vehicles, log fill-ups or charging sessions (vehicle, date, cost, litres or kWh, odometer reading) and compute a normalized cost-per-km across both fuel types so they're genuinely comparable, then surface which vehicles are most/least cost-efficient and trend whether costs are rising. Normalizing two different unit types (litres vs kWh) onto one comparable metric is a nice small design problem, and the EV-vs-ICE fleet comparison is a very live, very relatable theme for an automotive-adjacent enterprise audience right now.

**6. Driver Trip Log with Fatigue Risk Flag**
Drivers log trips (start time, end time, distance) for a fleet. The app tracks cumulative driving hours within a rolling 24-hour and 7-day window per driver and flags anyone approaching or exceeding a configurable safe-driving-hours limit (mirroring real hours-of-service regulations trucking/logistics clients actually have to comply with). The rolling-window calculation — not just "total hours today" but "hours in any 24-hour period" — is a genuinely fiddly bit of logic worth having Copilot reason through carefully, and it's a compliance story that lands instantly with an enterprise audience.

**7. Parts Compatibility Checker**
Given a small catalog of vehicle models (make, model, year range) and a catalog of parts (each part valid for a list of model/year combinations), build a tool where a service advisor enters a vehicle and a part name, and the app says whether that part fits — and if not, suggests the closest compatible alternative part. The "find a compatible substitute" branch is the interesting design problem, and parts-compatibility is an extremely recognizable pain point in any service/aftermarket conversation.

**8. Insurance Premium Estimator from Driving Profile**
Build a small calculator that takes a driver's profile (age, years licensed, vehicle type, annual mileage, claims in last 3 years) and computes an estimated premium using a tiered rule set with multiple interacting factors (e.g. a young driver with a clean record vs. an experienced driver with one claim shouldn't just stack penalties additively — there's a real "which rule wins" design conversation here). Good for showcasing how Copilot handles translating a written business-rules document into branching calculation logic, which is a very common real instructional-design scenario for you.

**9. Odometer Fraud / Anomaly Detector — Given, Not Built**
Hand learners an existing small app that logs odometer readings over time per vehicle (service visits, inspections, resale checks) and is supposed to flag suspicious entries — but ships with seeded bugs: it fails to flag a reading that decreases between two records, it doesn't catch an implausibly large jump in a short time window, it has a unit-mismatch bug (miles vs km readings mixed for imported vehicles), and one bug where reordering records by date doesn't actually re-sort before comparison, silently passing bad data through. This is your second "reasoning over unfamiliar code" option, and odometer fraud is a concrete, well-known automotive integrity problem that makes the bug hunt feel real rather than academic.

**10. Multi-Stop Delivery Route Sequencer (Simple)**
For a fleet delivery scenario, given a list of drop locations with approximate distances/times between them (a small precomputed distance table, not live mapping), compute a reasonably good visiting order to minimize total travel — not solving the full Traveling Salesman optimally, but using a simple greedy nearest-neighbor heuristic, which is exactly the kind of "good enough, explainable" algorithm Copilot can implement and explain cleanly in two hours. This one has the best live-demo payoff of the set: changing the stop list and watching the route reorder is visually satisfying and easy for a non-technical observer to follow.

---

## General Use Cases

**1. Conference Session Scheduler**
Given a list of sessions (title, speaker, duration, topic track) and a set of rooms (capacity, AV equipment), assign sessions to rooms and time slots automatically, respecting constraints — no speaker presenting in two rooms simultaneously, sessions needing AV only in AV-equipped rooms, same-track sessions not clashing so attendees can attend all of them. The constraint-satisfaction angle is genuinely interesting, and the domain is instantly relatable to any corporate training audience.

**2. Employee Leave Conflict Checker**
A team calendar tool where leave requests are submitted and automatically checked against a minimum-coverage rule — for example, a team of eight cannot have more than two people on leave simultaneously during a critical period, or specific role combinations must always be present. The "role-aware coverage" rule rather than just a headcount rule is the hook — straightforward headcount checking would be too simple, but factoring in that you always need at least one senior dev and one tester present makes it a real decision problem.

**3. Code Review Effort Estimator**
Given a pull request summary (number of files changed, lines added/deleted, whether tests are included, whether it touches a critical module), estimate review effort in hours using a weighted scoring model, and suggest an appropriate reviewer seniority level. Useful for showcasing how Copilot handles turning an informal team heuristic into an actual calculation — the design conversation around how to weight the factors is where the interesting pair discussion happens.

**4. Customer Churn Risk Scorer**
Log customers with a handful of behavioral signals — last login, support tickets raised, contract renewal date, feature usage drop — and compute a simple risk score with a traffic-light output (low/medium/high). Good for a sales or CRM-oriented audience, and the "which signals matter most and how do you weight them" question makes it a richer Copilot conversation than a single-formula calculator.

**5. Event Catering Calculator**
Given a guest list with dietary tags (vegetarian, vegan, gluten-free, nut allergy) and a menu with per-dish ingredients and per-head cost, compute exactly how many of each dish to prepare, flag any menu item that can't be served to a subset of guests, and output total cost broken down by dietary category. The allergy-conflict detection — where a dish is fine for vegetarians but not for someone who is also gluten-free — is a small set-intersection problem that trips up naive single-tag checking and gives Copilot something specific to reason carefully about.

**6. Bug Triage Age Analyzer — Given, Not Built**
Hand learners a small bug-tracking app that's supposed to calculate how long each open bug has been in each status (open → assigned → in progress → resolved), compute average time-in-status per severity level, and flag bugs that have been idle in one status longer than a configurable SLA threshold. Seed it with bugs: an off-by-one in business-days calculation (excludes the start day but shouldn't), a status-history sort order bug causing wrong duration calculations, a silent failure when a bug has never changed status, and a rounding inconsistency between hours and days display. Strong diagnostic session candidate for any software-engineering audience.

**7. Freelancer Invoice Validator**
A small tool where a freelancer logs time entries (date, project, hours, hourly rate) and the app generates an invoice summary — but also validates it: flags duplicate entries for the same date/project, checks that total billed hours don't exceed the contracted cap for that project in that month, warns if a rate was applied that differs from the agreed project rate, and calculates tax at a configurable percentage. The validation layer on top of the calculation is what makes this interesting — it's not just arithmetic, it's a set of cross-checks that interact with each other.

**8. Skill Gap Analyzer for a Team**
Given a target skill matrix for a project (role → required skills → proficiency level needed) and a team roster (person → role → current skills → proficiency level), compute which skills are covered, which are gaps, who on the team could upskill to cover a gap with minimal training delta, and which gaps have no viable internal candidate. This one lands especially well with an L&D or HR technology audience — and given your StackRoute positioning, it's a scenario your learners will find immediately self-referential and engaging.

**9. Notification Throttle Simulator**
Build a small system that processes a stream of incoming events (user ID, event type, timestamp) and applies throttle rules — no more than three notifications of the same type to the same user within a one-hour window, critical alerts always get through regardless, and a quiet-hours rule suppresses non-critical notifications outside business hours. Good for showcasing Copilot on event-processing logic with multiple interacting rules, which is a common real-world backend pattern your developer audiences will recognize immediately.

**10. Reading List Prioritizer**
Given a list of books/articles with metadata — topic, estimated read time, difficulty level, how long since it was added — compute a recommended reading order based on a configurable priority formula (e.g. weight towards shorter items if the user is time-constrained, towards foundational topics if they're a beginner, deprioritize items added more than six months ago as likely stale). The configurable weighting formula rather than a fixed ranking rule is the design conversation — there's no single right answer, which makes it a rich pairing exercise.
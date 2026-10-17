# Self-service target experience

The user-approved rebuild brief of 17 October 2026 supersedes the 16-persona/star experiment. **5★ means strong self-service with low cognitive load.** It is a design benchmark, not a selectable product mode.

- No star selector, star routes, star filters or star labels in ordinary product workflows.
- “5★ target experience” may appear in presenter/demo context only.
- Previous 7★, 9★ and 11★ implementations are dormant references, not supported destinations. Old URLs, history and stored preferences must not expose them.
- Only Business User and System User are active. Analyst and External Partner are visible, disabled and tagged Coming soon.
- Home, Catalogue and My Data replace the single-navigation-entry-per-combination rule.

One catalogue, one EDP and one governed request journey serve both perspectives. After approval, Business consumption leads to DIP Lite or an embedded DVP dashboard; System consumption leads to S3/VPC integration. Request intent selects the consumption route; presenter perspective selection is not a production prerequisite.

Minimize explicit steps. Scope across EDPs, intended use and fulfilment share one draft, followed by one review. Keep required linking fields clear and locked. My Data combines requests and access throughout their lifecycle.

Shared discovery does not grant shared authority. Each request retains its purpose, approved fields and destination; pending, denied and expired fields are unavailable.

Current scope lives in `targetModel.js`. The old `experienceCapabilities.js` and `experienceFlows.js` no longer govern active navigation. This explicit replacement takes precedence over historical star-isolation instructions in older reviews or the installed skill.

import { z } from 'zod';

import { FeatureType } from './common';
import { featureCopilot } from './copilot';
import { featureEarlyAccess } from './early-access';
import { featureUnlimitedWorkspace } from './unlimited-workspace';

/// ======== common schema ========

export enum FeatureKind {
  Feature,
  Quota,
}

export const commonFeatureSchema = z.object({
  feature: z.string(),
  type: z.nativeEnum(FeatureKind),
  version: z.number(),
  configs: z.unknown(),
});

export type CommonFeature = z.infer<typeof commonFeatureSchema>;

/// ======== feature define ========

export const Features: Feature[] = [
  {
    feature: FeatureType.Copilot,
    type: FeatureKind.Feature,
    version: 1,
    configs: {},
  },
  {
    feature: FeatureType.EarlyAccess,
    type: FeatureKind.Feature,
    version: 1,
    configs: {
      whitelist: ['@toeverything.info'],
    },
  },
  {
    feature: FeatureType.EarlyAccess,
    type: FeatureKind.Feature,
    version: 2,
    configs: {
      whitelist: [],
    },
  },
  {
    feature: FeatureType.UnlimitedWorkspace,
    type: FeatureKind.Feature,
    version: 1,
    configs: {},
  },
];

/// ======== schema infer ========

export const FeatureSchema = commonFeatureSchema
  .extend({
    type: z.literal(FeatureKind.Feature),
  })
  .and(
    z.discriminatedUnion('feature', [
      featureCopilot,
      featureEarlyAccess,
      featureUnlimitedWorkspace,
    ])
  );

export type Feature = z.infer<typeof FeatureSchema>;

export { FeatureType };

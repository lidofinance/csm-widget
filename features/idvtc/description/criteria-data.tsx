import { ReactNode } from 'react';

export type CriterionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export const CRITERIA: CriterionItem[] = [
  {
    id: 'cluster-composition',
    title: 'Cluster composition and proof of independence',
    content: (
      <ul>
        <li>One CSM operator can be a participant in only one IDVTC.</li>
        <li>A DVT cluster must consist of 4 independent participants.</li>
        <li>
          Each participant must have an approved ICS application (or must be an
          ICS operator).
        </li>
        <li>
          Keys must be generated via DKG with artifacts including:
          <ul>
            <li>cluster-lock.json file for Obol clusters.</li>
            <li>proofs.json file for SSV clusters.</li>
          </ul>
        </li>
        <li>
          The cluster formation requires signatures from each member, linking
          their ICS identity to the cluster.
        </li>
        <li>
          The cluster must provide a contact information Lido contributors can
          use in case of issues with the DKG verification.
        </li>
        <li>
          Operators must agree to enrol in monitoring via DVT provider specific
          tooling (e.g. Obol Grafana metrics, automatic SSV Network metrics).
        </li>
      </ul>
    ),
  },
  {
    id: 'obligation-to-run-dvt',
    title: 'Obligation to run DVT',
    content: (
      <ul>
        <li>IDVTC operators must run validators using Obol or SSV.</li>
        <li>
          IDVTC operators must generate the keys via DKG ceremony and provide
          proof of the output.
        </li>
        <li>
          Switching DVT providers is allowed as long as it remains within the
          approved set and is reported/observable (will require exit-enter
          procedure).
        </li>
      </ul>
    ),
  },
  {
    id: 'downgrade-policy',
    title: 'Downgrade policy',
    content: (
      <>
        <p>
          If an IDVTC is detected and reported by the CSM committee as not using
          DVT (or otherwise failing type requirements):
        </p>
        <ul>
          <li>The operator&apos;s type is downgraded.</li>
          <li>
            The operator fee and bond requirements are changed accordingly to a
            default CSM type, which will likely cause ejection of some of the
            keys due to them becoming unbonded. CSM Committee can also consider
            downgrading participants&apos; ICS type in case such violation is
            committed.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'replacing-cluster-member',
    title: 'Replacing a cluster member',
    content: (
      <>
        <p>
          Identified DVTCs may replace participants over time (e.g. if someone
          stops operating), while keeping the cluster within the IDVTC operator
          type requirements.
        </p>
        <p>If a participant is replaced:</p>
        <ul>
          <li>The new participant must be another ICS-approved participant.</li>
          <li>
            No participant may be a member of more than one IDVTC at the same
            time.
          </li>
          <li>The cluster must submit a new 4-signature cluster statement.</li>
          <li>Monitoring must remain in place for all nodes.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ics-idvtc-compatibility',
    title: 'ICS <> IDVTC compatibility',
    content: (
      <p>
        One CSM operator can have only one Node Operator of the ICS type, as
        well as be a participant in only one IDVTC.
      </p>
    ),
  },
];

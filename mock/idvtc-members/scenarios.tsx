import { Button } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';
import { MembersSection } from 'features/idvtc/members/initialized/members-section';
import { NotInitialized } from 'features/idvtc/members/not-initialized/not-initialized';
import { useConfirmRotationModal } from 'features/idvtc/members/rotation/confirm-rotation-modal';
import {
  ACTIVE_ADDRESSES,
  PROPOSED_ADDRESSES,
  initRejectedRequest,
  initReviewRequest,
  mockMembers,
  pendingOneRequest,
  pendingTwoRequest,
  rejectedRequest,
} from './data';

const ConfirmModalPreview: FC = () => {
  const confirm = useConfirmRotationModal();
  return (
    <Button
      onClick={() =>
        void confirm({
          currentAddress: ACTIVE_ADDRESSES[1],
          newAddress: PROPOSED_ADDRESSES[0],
        })
      }
    >
      Open confirm rotation modal
    </Button>
  );
};

export type TestScenario = {
  group: string;
  title: string;
  description: string;
  render: () => ReactNode;
};

export const testScenarios: TestScenario[] = [
  {
    group: 'members',
    title: 'Idle (manager)',
    description:
      '4 verified members with Rotate buttons. Press Rotate to open the inline editor (siblings dim); typing an address generates the message to sign. Verify/submit hit the real API and fail on the stand.',
    render: () => (
      <MembersSection members={mockMembers} request={null} canManage />
    ),
  },
  {
    group: 'members',
    title: 'Idle (read-only)',
    description:
      'Viewer without manager/rewards role: same cards, no action buttons',
    render: () => (
      <MembersSection members={mockMembers} request={null} canManage={false} />
    ),
  },
  {
    group: 'members',
    title: 'Pending rotation (1 slot)',
    description:
      'Member #2 has an under-review rotation: proposed address block + Cancel rotation button. Other members keep their Rotate buttons',
    render: () => (
      <MembersSection
        members={mockMembers}
        request={pendingOneRequest}
        canManage
      />
    ),
  },
  {
    group: 'members',
    title: 'Pending rotation (2 slots)',
    description: 'Members #2 and #4 both have under-review rotations',
    render: () => (
      <MembersSection
        members={mockMembers}
        request={pendingTwoRequest}
        canManage
      />
    ),
  },
  {
    group: 'members',
    title: 'Pending rotation (read-only)',
    description: 'Viewer sees the under-review block without any buttons',
    render: () => (
      <MembersSection
        members={mockMembers}
        request={pendingOneRequest}
        canManage={false}
      />
    ),
  },
  {
    group: 'members',
    title: 'Rejected rotation',
    description:
      'Member #2 rotation rejected: Rejected chip, per-slot comment and request-level reason as error footnotes, Rotate button to start a fresh request',
    render: () => (
      <MembersSection
        members={mockMembers}
        request={rejectedRequest}
        canManage
      />
    ),
  },
  {
    group: 'init',
    title: 'Not initialized — bindable form',
    description:
      'Manager with an approved unbound IDVTC form: single Initialize button (click hits the real API and fails on the stand)',
    render: () => <NotInitialized request={null} canManage isBindable />,
  },
  {
    group: 'init',
    title: 'Not initialized — from-scratch editor',
    description:
      'No bindable form: all 4 members entered at once, progress bar counts verified slots, submit disabled until 4/4',
    render: () => (
      <NotInitialized request={null} canManage isBindable={false} />
    ),
  },
  {
    group: 'init',
    title: 'From-scratch request under review',
    description:
      '4 pending cards without a current-member part + a single full-width Cancel rotation (per-slot cancel is forbidden for uninitialized operators)',
    render: () => (
      <NotInitialized
        request={initReviewRequest}
        canManage
        isBindable={false}
      />
    ),
  },
  {
    group: 'init',
    title: 'From-scratch request rejected',
    description:
      'Rejected cards with comments + Submit a new request → fresh editor with Cancel to return',
    render: () => (
      <NotInitialized
        request={initRejectedRequest}
        canManage
        isBindable={false}
      />
    ),
  },
  {
    group: 'init',
    title: 'Not initialized (read-only)',
    description: 'Viewer without roles sees the informational block only',
    render: () => (
      <NotInitialized request={null} canManage={false} isBindable={false} />
    ),
  },
  {
    group: 'modal',
    title: 'Confirm rotation modal',
    description:
      'F4 modal preview: current → new address comparison, checkbox gates the Submit rotation request button',
    render: () => <ConfirmModalPreview />,
  },
];

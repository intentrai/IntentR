import React from 'react';
import { WizardLayout } from '../../components/wizard';
import { Testing } from '../Testing';

export const WizardControlLoop: React.FC = () => {
  return (
    <WizardLayout>
      <div className="wizard-control-loop">
        <div className="wizard-control-loop-header">
          <h2>Control Loop Phase</h2>
          <p>Define test scenarios and acceptance criteria using BDD/Gherkin syntax for ongoing quality assurance.</p>
        </div>

        <div className="wizard-control-loop-content">
          <Testing />
        </div>
      </div>

      <style>{`
        .wizard-control-loop-header {
          margin-bottom: 1.5rem;
        }

        .wizard-control-loop-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-grey-900);
          margin-bottom: 0.5rem;
        }

        .wizard-control-loop-header p {
          color: var(--color-grey-600);
        }

        .wizard-control-loop-content {
          min-height: 400px;
        }
      `}</style>
    </WizardLayout>
  );
};

export default WizardControlLoop;

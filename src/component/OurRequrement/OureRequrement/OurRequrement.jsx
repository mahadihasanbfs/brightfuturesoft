import React, { useState } from 'react';
import vc1 from '../../../Assctes/vectors/1.png';
import vc2 from '../../../Assctes/vectors/2.png';
import vc3 from '../../../Assctes/vectors/3.png';
import vc4 from '../../../Assctes/vectors/4.png';
import vc5 from '../../../Assctes/vectors/5.png';
import vc6 from '../../../Assctes/vectors/6.png';
import vc7 from '../../../Assctes/vectors/7.png';

const phases = [
  { name: 'Discover', title: 'Understand the opportunity', description: 'We listen, ask the right questions, and map the goals, users, and constraints that matter.', pic: vc1 },
  { name: 'Plan', title: 'Turn needs into a clear plan', description: 'We align on scope, priorities, and a practical roadmap before moving into design and development.', pic: vc2 },
  { name: 'Design', title: 'Make the experience clear', description: 'We shape the product structure and interface around real user needs and business outcomes.', pic: vc3 },
  { name: 'Build', title: 'Develop with care', description: 'Our team builds in focused stages, sharing progress and keeping quality part of the process.', pic: vc4 },
  { name: 'Test', title: 'Refine every detail', description: 'We test the product across key flows and devices, then resolve issues before launch.', pic: vc5 },
  { name: 'Launch', title: 'Release with confidence', description: 'We prepare the production environment and support a smooth, well-managed launch.', pic: vc6 },
  { name: 'Support', title: 'Keep improving over time', description: 'After release, we help maintain, improve, and grow the product as your needs evolve.', pic: vc7 },
];

const OurRequrement = () => {
  const [activePhase, setActivePhase] = useState(0);
  const active = phases[activePhase];

  return (
    <section className="process-section px-4 py-20 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl">
        <div className="section-heading-row">
          <div>
            <span className="site-eyebrow">A thoughtful process</span>
            <h2 id="process-heading">From first conversation<br /><span>to lasting impact.</span></h2>
          </div>
          <p>Good software is built through clear decisions, close collaboration, and steady progress at every stage.</p>
        </div>
        <div className="process-layout">
          <div className="process-feature">
            <div className="process-art"><img src={active.pic} alt="" /></div>
            <div className="process-copy">
              <span className="process-count">0{activePhase + 1} / 07</span>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </div>
          </div>
          <div className="process-steps" role="tablist" aria-label="Our development process">
            {phases.map((phase, index) => (
              <button key={phase.name} type="button" role="tab" aria-selected={activePhase === index} onClick={() => setActivePhase(index)} className={`process-step ${activePhase === index ? 'is-active' : ''}`}>
                <span>0{index + 1}</span><strong>{phase.name}</strong><i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurRequrement;

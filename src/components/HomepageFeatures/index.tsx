import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  img: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '系统化优化',
    img: '/img/optimize.png',
    description: (
      <>
        选择一种优化器来增强您的程序。无论是生成精细指令，还是微调权重，DSPy的优化器旨在最大化效率和有效性。
      </>
    ),
  },
  {
    title: '模块化方法',
    img: '/img/modular.png',
    description: (
      <>
        使用 DSPy，您可以使用预定义的模块构建系统，用简单而有效的解决方案取代复杂的提示技术。
      </>
    ),
  },
  {
    title: '跨模型兼容性',
    img: '/img/universal_compatibility.png',
    description: (
      <>
        无论您使用强大的模型，如 GPT-3.5 或 GPT-4，还是本地模型，如 T5-base 或 Llama2-13b，DSPy 都可以无缝集成和增强它们在您系统中的性能。
      </>
    ),
  },
];

function Feature({title, img, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} src={img} alt={title}  style={{objectFit: 'cover'}} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features} style={{marginBottom: "2rem"}}>
      <div className="container">
        <p style={{color:`var(--hero-text-color)`, fontWeight:"700", fontSize: "2rem", textAlign: "center"}}>DSPy之道</p>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

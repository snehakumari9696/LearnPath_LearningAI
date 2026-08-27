import React from 'react';
import { DataScientistIcon, MLEngineerIcon, DeepLearningIcon, NLPSpecialistIcon } from './SkillIcons';
import { SkillField } from '../types';

interface KeySkillsSectionProps {
  onSelectSkill: (skill: SkillField) => void;
}

export const skillsData: SkillField[] = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Statistical Modeling & Big Data',
    description: 'Transform complex multi-modal datasets into predictive models, statistical inferences, and actionable business intelligence using modern ML algorithms.',
    iconType: 'data-scientist',
    coursesCount: 14,
    projectsCount: 28,
    salaryRange: '$125,000 - $185,000',
    topics: ['Statistical Inference', 'Feature Engineering', 'XGBoost & LightGBM', 'Data Pipelines & Spark', 'Predictive Modeling', 'Bayesian Methods']
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    category: 'Production Systems & MLOps',
    description: 'Design, deploy, and scale robust machine learning pipelines in production with continuous training, model monitoring, low-latency inference, and edge deployment.',
    iconType: 'ml-engineer',
    coursesCount: 18,
    projectsCount: 32,
    salaryRange: '$145,000 - $215,000',
    topics: ['MLOps & CI/CD', 'Docker & Kubernetes', 'TensorRT & ONNX', 'Distributed Training', 'Model Quantization', 'Feature Stores (Feast)']
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    category: 'Neural Architectures & Vision',
    description: 'Master convolutional, recurrent, and transformer architectures. Build computer vision systems, generative models, diffusion networks, and reinforcement learning agents.',
    iconType: 'deep-learning',
    coursesCount: 22,
    projectsCount: 40,
    salaryRange: '$150,000 - $230,000',
    topics: ['PyTorch Deep Dive', 'Vision Transformers (ViT)', 'Diffusion Models', 'Autoencoders & GANs', 'Reinforcement Learning', 'Graph Neural Networks']
  },
  {
    id: 'nlp-specialist',
    title: 'NLP Specialist',
    category: 'LLMs & Conversational AI',
    description: 'Master Large Language Models, prompt engineering, fine-tuning (LoRA/QLoRA), Retrieval-Augmented Generation (RAG), embeddings, and agentic workflows.',
    iconType: 'nlp-specialist',
    coursesCount: 16,
    projectsCount: 36,
    salaryRange: '$140,000 - $210,000',
    topics: ['LLM Fine-tuning', 'RAG & Vector DBs', 'Prompt Engineering', 'LangChain & LlamaIndex', 'Tokenization & Attention', 'Agent Orchestration']
  }
];

export const KeySkillsSection: React.FC<KeySkillsSectionProps> = ({ onSelectSkill }) => {
  return (
    <div className="relative z-10 pt-2 pb-6">
      {/* Category Heading matching reference text */}
      <h2 className="text-base sm:text-lg font-medium text-[#94a3b8] mb-6 tracking-wide">
        Key Skills &amp; Career Fields:
      </h2>

      {/* 4 Skill Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-2xl lg:max-w-3xl">
        
        {/* 1. Data Scientist */}
        <div 
          onClick={() => onSelectSkill(skillsData[0])}
          className="group cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
            <DataScientistIcon className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] group-hover:drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
          </div>
          <span className="text-sm sm:text-[15px] font-medium text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
            Data Scientist
          </span>
        </div>

        {/* 2. ML Engineer */}
        <div 
          onClick={() => onSelectSkill(skillsData[1])}
          className="group cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
            <MLEngineerIcon className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] group-hover:drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
          </div>
          <span className="text-sm sm:text-[15px] font-medium text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
            ML Engineer
          </span>
        </div>

        {/* 3. Deep Learning */}
        <div 
          onClick={() => onSelectSkill(skillsData[2])}
          className="group cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
            <DeepLearningIcon className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.4)] group-hover:drop-shadow-[0_0_18px_rgba(250,204,21,0.7)]" />
          </div>
          <span className="text-sm sm:text-[15px] font-medium text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
            Deep Learning
          </span>
        </div>

        {/* 4. NLP Specialist */}
        <div 
          onClick={() => onSelectSkill(skillsData[3])}
          className="group cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
            <NLPSpecialistIcon className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] group-hover:drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
          </div>
          <span className="text-sm sm:text-[15px] font-medium text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
            NLP Specialist
          </span>
        </div>

      </div>
    </div>
  );
};

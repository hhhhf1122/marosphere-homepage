import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="mb-8 sm:mb-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-white tracking-wider text-center">{title}</h1>
    </div>
  );
};

export default SectionHeader;
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import { DiJava } from 'react-icons/di';
import {
  SiSpring,
  SiApachekafka,
  SiCamunda,
  SiKubernetes,
  SiAmazonwebservices,
  SiJenkins,
  SiDocker,
  SiAngular,
  SiReact
} from 'react-icons/si';
import {
  FaLanguage,
  FaProjectDiagram,
  FaBook,
  FaPlayCircle,
  FaDatabase,
  FaTools,
  FaCloud,
  FaWrench,
  FaChartBar,
  FaExchangeAlt
} from 'react-icons/fa';
import { MdStorage, MdDevices, MdBugReport, MdPhoneIphone } from 'react-icons/md';

// Custom Apache Camel SVG Icon
const CamelIcon = ({ size = 24, className = "", ...props }) => (
  <img
    src={process.env.PUBLIC_URL + '/assets/images/camel.svg'}
    alt="Apache Camel"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain', display: 'inline-block' }}
    {...props}
  />
);

function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}) {
  // Map technology names to react-icons/simple-icons
  const techIcons = {
    LANGUAGE: FaLanguage,
    BACKEND: MdStorage,
    FRAMEWORK: FaProjectDiagram,
    BPM: FaProjectDiagram, // Could also use FaSitemap if desired
    CAMUNDA: SiCamunda,
    LIBRARY: FaBook,
    RUNTIME: FaPlayCircle,
    DATABASE: FaDatabase,
    DEVOPS: FaTools,
    CLOUD: FaCloud,
    TOOL: FaWrench,
    PLATFORM: MdDevices,
    TESTING: MdBugReport,
    DATA: FaChartBar,
    MOBILE: MdPhoneIphone,
    KAFKA: SiApachekafka,
    JMS: FaExchangeAlt,
    KUBERNETES: SiKubernetes,
    DOCKER: SiDocker,
    JAVA: DiJava,
    ANGULAR: SiAngular,
    REACT: SiReact,
    Spring: SiSpring,
    AWS: SiAmazonwebservices,
    Jenkins: SiJenkins,
    Camel: CamelIcon
  };

  const IconComponent = LucideIcons?.[name] || techIcons?.[name];

  if (!IconComponent) {
    return (
      <HelpCircle
        size={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  // react-icons don't support strokeWidth, so only pass it for Lucide
  if (LucideIcons?.[name]) {
    return (
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  } else {
    return (
      <IconComponent
        size={size}
        color={color}
        className={className}
        {...props}
      />
    );
  }
}

export default Icon;
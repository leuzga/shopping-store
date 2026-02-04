export interface AboutUsLabels {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  objectives: {
    title: string;
    items: { title: string; description: string }[];
  };
  experience: {
    title: string;
    description: string;
  };
  bestRetail: {
    title: string;
    description: string;
  };
}

export interface FooterLabels {
  copyright: string;
  createdBy: string;
  allRightsReserved: string;
  year: number;
  about: {
    title: string;
    description: string;
    buttonText: string;
  };
  services: {
    title: string;
    items: string[];
  };
  usefulLinks: {
    title: string;
    items: string[];
  };
  contact: {
    title: string;
    address: string;
    email: string;
    phone: string;
    mailOn: string;
    callOn: string;
  };
  legal: {
    privacy: string;
    terms: string;
  };
  brands: string[];
}

export interface ContactUsLabels {
  hero: {
    title: string;
    subtitle: string;
  };
  form: {
    name: string;
    email: string;
    subject: string;
    message: string;
    submit: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderSubject: string;
    placeholderMessage: string;
  };
  info: {
    title: string;
    description: string;
    address: string;
    email: string;
    phone: string;
  };
}

export interface UILabels {
  footer: FooterLabels;
  aboutPage: AboutUsLabels;
  contactPage: ContactUsLabels;
}

export const UI_LABELS: UILabels = {
  footer: {
    copyright: '©',
    createdBy: 'Created by Shopping Store',
    allRightsReserved: 'All Rights Reserved',
    year: new Date().getFullYear(),
    about: {
      title: 'Sobre Shopping Store',
      description: 'Bienvenidos a Shopping Store, su destino principal para productos de alta calidad. Con más de 20 años de excelencia en retail, estamos comprometidos a brindar a nuestros clientes una amplia gama de artículos premium y un servicio excepcional. Nos esforzamos por ser su socio de mayor confianza en cada compra.',
      buttonText: 'Leer más',
    },
    services: {
      title: 'Services',
      items: [
        'Medical', 'Family', 'Children', 'Education', 'Community', 'Disaster'
      ]
    },
    usefulLinks: {
      title: 'Usefull Links',
      items: [
        'Our Mission', 'Financials', 'Careers', 'Contact', 'Store', 'Reports'
      ]
    },
    contact: {
      title: 'Contact Us',
      address: '5171 W Campbell Ave undefined Kent, Utah 53127 United States',
      email: 'support@example.com',
      phone: '1800 123 45 67',
      mailOn: 'Mail on:',
      callOn: 'Call on:',
    },
    legal: {
      privacy: 'Privacy Policy',
      terms: 'Terms and Conditions',
    },
    brands: [
      'POOR FUND', "SENIOR'S LOVE", 'CHILD CARE', 'SAVE CHILD', 'BLOODYS'
    ],
  },
  aboutPage: {
    hero: {
      title: 'Shopping Store',
      subtitle: 'Más de 20 años liderando el retail de calidad',
      description: 'Nuestra pasión por la excelencia nos ha convertido en el referente del mercado, ofreciendo siempre lo mejor para nuestros clientes.'
    },
    objectives: {
      title: 'Nuestros Objetivos',
      items: [
        {
          title: 'Excelencia en el Servicio',
          description: 'Brindar una experiencia de compra inigualable, centrada en las necesidades de cada cliente.'
        },
        {
          title: 'Calidad Premium',
          description: 'Garantizar que cada producto en nuestras estanterías cumpla con los más altos estándares.'
        },
        {
          title: 'Innovación Constante',
          description: 'Adoptar las últimas tendencias y tecnologías para mejorar continuamente el retail.'
        }
      ]
    },
    experience: {
      title: 'Dos Décadas de Experiencia',
      description: 'Desde nuestra fundación, hemos crecido junto a nuestra comunidad. Nuestra trayectoria está marcada por la confianza, la integridad y un compromiso inquebrantable con la satisfacción del cliente. Hemos perfeccionado el arte del retail para ofrecer no solo productos, sino soluciones de estilo de vida.'
    },
    bestRetail: {
      title: 'El mejor retail de su tipo',
      description: 'No somos solo una tienda; somos un estándar de calidad. Nuestra selección curada y nuestra atención personalizada nos posicionan como el líder indiscutible en el sector.'
    }
  },
  contactPage: {
    hero: {
      title: 'Contáctanos',
      subtitle: 'Estamos aquí para ayudarte'
    },
    form: {
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      subject: 'Asunto',
      message: 'Mensaje',
      submit: 'Enviar Mensaje',
      placeholderName: 'Tu nombre aquí...',
      placeholderEmail: 'ejemplo@correo.com',
      placeholderSubject: '¿En qué podemos ayudarte?',
      placeholderMessage: 'Escribe tu mensaje aquí...'
    },
    info: {
      title: 'Información de Contacto',
      description: 'Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros a través del formulario o nuestros canales directos.',
      address: '5171 W Campbell Ave Kent, Utah 53127, EE. UU.',
      email: 'soporte@shoppingstore.com',
      phone: '+1 800 123 45 67'
    }
  }
};

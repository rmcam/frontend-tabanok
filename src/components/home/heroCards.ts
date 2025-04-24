export const heroCardsData = [
  {
    title: 'Transforma la educación',
    description: 'Aprende Kamëntsá de forma divertida y efectiva. ¡Únete ahora!',
    buttons: [
      { label: 'Comienza ahora', variant: 'default' as const, action: 'openSignupModal' as const }, // Cambiado action a href
      { label: 'Más información', variant: 'secondary' as const, href: '/about' },
      { label: 'Lecciones populares', variant: 'link' as const, href: '/lessons' },
    ],
    imageSrc: '/images/home/ninos_kamentsa.webp',
    alt: 'Niños Kamëntsá',
    href: '/lessons',
  },
  {
    title: 'Potencia tu enseñanza',
    buttons: [
      { label: 'Comienza ahora', variant: 'default' as const, action: 'openSignupModal' as const }, // Cambiado action a href
      { label: 'Más información', variant: 'secondary' as const, href: '/about' },
    ],
    description:
      'Facilitamos el aprendizaje con recursos interactivos. Accede a estadísticas y reportes detallados.',
    imageSrc: '/images/home/mineducacion_1.webp',
    alt: 'Mineducación 1',
    href: '/teachers',
  },
  {
    title: 'Cómo funciona',
    buttons: [],
    description:
      'Una guía sencilla para comenzar. Crea y organiza lecciones fácilmente. Diseña actividades que fomenten la participación. Estructura el contenido de manera efectiva. Monitorea el rendimiento de tus estudiantes.',
    imageSrc: '/images/home/mineducacion_2.webp',
    alt: 'Mineducación 2',
    href: '/how-it-works',
  },
  {
    title: 'Actividades Recomendadas',
    buttons: [],
    description:
      'Descubre nuevas actividades para aprender la lengua Kamëntsá. Aprende a saludar en Kamëntsá. Aprende los números en Kamëntsá. Aprende los colores en Kamëntsá.',
    imageSrc: '/images/home/colombia_travel.webp',
    alt: 'Colombia Travel',
    href: '/activities',
  },
  {
    title: 'Últimas Lecciones',
    buttons: [],
    description:
      'Descubre las últimas lecciones creadas por nuestros docentes. Aprende los nombres de los animales en Kamëntsá. Aprende los nombres de la comida en Kamëntsá. Aprende los nombres de los miembros de la familia en Kamëntsá.',
    imageSrc: '/images/home/ninos_kamentsa.webp',
    alt: 'Niños Kamëntsá',
    href: '/latest-lessons',
  },
  {
    title: 'Evaluaciones Efectivas',
    buttons: [],
    description:
      'Recibe retroalimentación instantánea. Motiva a tus estudiantes con recompensas. Interfaz intuitiva y culturalmente relevante. Diseñado para todos los usuarios.',
    imageSrc: '/images/home/mineducacion_1.webp',
    alt: 'Mineducación 1',
    href: '/evaluations',
  },
  {
    title: 'Nuestra misión es empoderar a los docentes',
    buttons: [],
    description: 'Facilitamos el aprendizaje de la lengua Kamëntsá.',
    imageSrc: '/images/home/colombia_travel.webp',
    alt: 'Colombia Travel',
    href: '/mission',
  },
];

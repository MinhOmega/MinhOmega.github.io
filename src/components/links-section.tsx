'use client'

import { motion, AnimatePresence } from "framer-motion";
import { IconMap } from "@/components/icon-map";

type ProjectLink = {
  name: string;
  url: string;
};

const LinksSection = ({ links }: { links: ProjectLink[] }) => {
  const hasMoreLinks = links.length > 3;
  const remainingCount = links.length - 3;
  const visibleLinks = links.slice(0, 3);
  const hiddenLinks = links.slice(3);

  return (
    <motion.div 
      className="relative group"
      initial="collapsed"
      whileHover="expanded"
      whileTap="expanded"
      transition={{
        staggerChildren: 0.07,
        delayChildren: 0.2
      }}
    >
      <motion.div 
        className="flex flex-wrap items-center gap-2"
        variants={{
          collapsed: {},
          expanded: {}
        }}
      >
        {visibleLinks.map((link, i) => (
          <motion.a
            key={i}
            href={link.url}
            target="_blank"
            className="social-link"
            initial={{ opacity: 1 }}
            variants={{
              collapsed: { opacity: 1 },
              expanded: { opacity: 1 }
            }}
          >
            {IconMap[link.name.toLowerCase() as keyof typeof IconMap]}
            <span className="sr-only">
              {`${link.name} - ${link.url}`}
            </span>
          </motion.a>
        ))}

        <AnimatePresence>
          {hasMoreLinks && (
            <motion.div 
              key="more-count"
              className="relative"
              variants={{
                collapsed: { 
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: 0.1
                  },
                  display: "block"
                },
                expanded: { 
                  opacity: 0,
                  x: 10,
                  transition: {
                    duration: 0.2,
                    ease: "easeOut",
                    delay: 0.1
                  },
                  display: "none"
                }
              }}
            >
              <motion.span 
                className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/80 text-secondary-foreground shadow-sm backdrop-blur-sm"
                initial={{ scale: 0.9 }}
                animate={{ 
                  scale: [0.9, 1, 0.9]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                +{remainingCount}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hiddenLinks.map((link, i) => (
            <motion.a
              key={i + 3}
              href={link.url}
              target="_blank"
              className="social-link"
              variants={{
                collapsed: { 
                  opacity: 0,
                  scale: 0.8,
                  x: -20,
                  transition: {
                    duration: 0.2,
                    delay: 0.1
                  }
                },
                expanded: { 
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  transition: {
                    duration: 0.3,
                    delay: 0.3 + (i * 0.05)
                  }
                }
              }}
            >
              {IconMap[link.name.toLowerCase() as keyof typeof IconMap]}
              <span className="sr-only">
                {`${link.name} - ${link.url}`}
              </span>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

LinksSection.displayName = "LinksSection";
export default LinksSection;

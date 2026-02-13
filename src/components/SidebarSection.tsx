import { useState, type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

interface SidebarSectionProps {
  name: string;
  children: ReactNode;
}

export default function SidebarSection({ name, children }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar-section">
      <div className="sidebar-section__header" onClick={() => setIsOpen(!isOpen)}>
        <div className="sidebar-section__header__caret">
          {isOpen
            ? <FontAwesomeIcon icon={faCaretDown} />
            : <FontAwesomeIcon icon={faCaretRight} />
          }
        </div>
        <div className="sidebar-section__header__name">
          {name}
        </div>
      </div>
      {isOpen && (
        <div className="sidebar-section__body">
          {children}
        </div>
      )}
      <div className="sidebar-section__footer" />
    </div>
  );
}

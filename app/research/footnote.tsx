"use client";

import React from "react";

interface Footnote {
  idRef: string;
  idNote: string;
  description: React.ReactNode;
}

interface FootnotesContextType {
  footnotes: Map<string, Footnote>;
  footnotesTitleId: string;
  getFootnoteRefId: (props: FootnoteRefProps) => string;
  getFootnoteId: (props: FootnoteRefProps) => string;
  register: (footnote: Footnote) => () => void;
}

interface FootnoteRefProps {
  description: React.ReactNode;
  children?: React.ReactNode | undefined;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface FootnotesProps {
  Wrapper?: React.ElementType;
  Title?: React.FC<{ id: string }>;
  List?: React.ElementType;
  ListItem?: React.ElementType;
  BackLink?: React.FC<{ href: string; "aria-label": string; role: string }>;
}

interface FootnotesProviderProps {
  children: React.ReactNode;
  footnotesTitleId?: string;
}

const FootnotesContext = React.createContext<FootnotesContextType | null>(null);

export const FootnoteRef: React.FC<FootnoteRefProps> = (props) => {
  const { description, children, id, className, style } = props;
  const context = React.useContext(FootnotesContext);
  if (!context) {
    throw new Error("FootnoteRef must be used within a FootnotesProvider");
  }
  const {
    footnotes,
    footnotesTitleId,
    getFootnoteRefId,
    getFootnoteId,
    register,
  } = context;

  const idRef = React.useMemo(
    () => getFootnoteRefId(props),
    [getFootnoteRefId, props]
  );
  const idNote = React.useMemo(
    () => getFootnoteId(props),
    [getFootnoteId, props]
  );
  const footnote = React.useMemo(
    () => ({ idRef, idNote, description }),
    [idRef, idNote, description]
  );

  // Register footnote for SSR compatibility by mutating directly
  if (!footnotes.has(footnote.idRef)) {
    footnotes.set(footnote.idRef, footnote);
  }

  React.useEffect(() => {
    const unregister = register(footnote);
    return () => unregister();
  }, [register, footnote]);

  return (
    <a
      className={className}
      style={style}
      id={idRef}
      href={`#${idNote}`}
      role="doc-noteref"
      aria-describedby={footnotesTitleId}
      data-a11y-footnotes-ref
    >
      {children}
    </a>
  );
};

export const Footnotes: React.FC<FootnotesProps> = ({
  Wrapper = "footer",
  Title = ({ id }) => <h2 id={id}>Footnotes</h2>,
  List = "ol",
  ListItem = "li",
  BackLink = (props) => <a {...props}>↩</a>,
}) => {
  const context = React.useContext(FootnotesContext);
  if (!context) {
    throw new Error("Footnotes must be used within a FootnotesProvider");
  }
  const { footnotes, footnotesTitleId } = context;

  if (footnotes.size === 0) return null;

  const references = Array.from(footnotes.values());

  return (
    <Wrapper data-a11y-footnotes-footer role="doc-endnotes">
      <Title data-a11y-footnotes-title id={footnotesTitleId} />
      <List data-a11y-footnotes-list>
        {references.map(({ idNote, idRef, description }, index) => (
          <ListItem id={idNote} key={idNote} data-a11y-footnotes-list-item>
            {description}&#160;
            <BackLink
              data-a11y-footnotes-back-link
              href={`#${idRef}`}
              aria-label={`Back to reference ${index + 1}`}
              role="doc-backlink"
            />
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
};

export const FootnotesProvider: React.FC<FootnotesProviderProps> = ({
  children,
  footnotesTitleId = "footnote-label",
}) => {
  const [footnotes, setFootnotes] = React.useState<Map<string, Footnote>>(
    new Map()
  );
  const getBaseId = React.useCallback(
    ({ id, children }: FootnoteRefProps) => id || getIdFromTree(children),
    []
  );
  const getFootnoteRefId = React.useCallback(
    (props: FootnoteRefProps) => getBaseId(props) + "-ref",
    [getBaseId]
  );
  const getFootnoteId = React.useCallback(
    (props: FootnoteRefProps) => getBaseId(props) + "-note",
    [getBaseId]
  );

  React.useEffect(() => setFootnotes(new Map()), []);

  const register = React.useCallback((footnote: Footnote) => {
    setFootnotes((prevFootnotes) => {
      const clone = new Map(prevFootnotes);
      if (!clone.has(footnote.idRef)) clone.set(footnote.idRef, footnote);
      return clone;
    });

    return () => {
      setFootnotes((prevFootnotes) => {
        const clone = new Map(prevFootnotes);
        clone.delete(footnote.idRef);
        return clone;
      });
    };
  }, []);

  return (
    <FootnotesContext.Provider
      value={{
        footnotes,
        footnotesTitleId,
        getFootnoteRefId,
        getFootnoteId,
        register,
      }}
    >
      {children}
    </FootnotesContext.Provider>
  );
};

function getTextFromTree(tree: React.ReactNode): string {
  let text = "";
  if (typeof tree === "string") {
    text += tree;
  } else if (Array.isArray(tree)) {
    text += tree.map(getTextFromTree).join("");
  } else if (React.isValidElement(tree)) {
    const element = tree as React.ReactElement<{ children?: React.ReactNode }>;
    if (element.props && element.props.children) {
      text += getTextFromTree(element.props.children);
    }
  }
  return text;
}

export function getIdFromTree(tree: React.ReactNode): string {
  return getTextFromTree(tree)
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/\s+/g, "-");
}

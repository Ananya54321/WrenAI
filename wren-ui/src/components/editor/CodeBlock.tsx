import { Typography } from 'antd';
import { useEffect } from 'react';
import styled from 'styled-components';
import '@/components/editor/AceEditor';

const Block = styled.div<{ inline?: boolean }>`
  position: relative;
  white-space: pre;
  ${(props) =>
    props.inline
      ? `display: inline; border: none; background: transparent !important; padding: 0;`
      : `background: var(--gray-1); padding: 4px;`}

  .line-number {
    user-select: none;
    display: inline-block;
    min-width: 1.5em;
    text-align: right;
    margin-right: 1em;
    color: var(--gray-6);
    font-weight: 700;
    font-size: 14px;
  }
`;

const CopyText = styled(Typography.Text)`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0;
  .ant-typography-copy {
    font-size: 12px;
  }
`;

interface Props {
  code: string;
  inline?: boolean;
  copyable?: boolean;
  showLineNumbers?: boolean;
}

const addThemeStyleManually = (cssText) => {
  // same id as ace editor appended, it will exist only one.
  const id = 'ace-tomorrow';
  const themeElement = document.getElementById(id);
  if (!themeElement) {
    const styleElement = document.createElement('style');
    styleElement.id = id;
    document.head.appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(cssText));
  }
};

export default function CodeBlock(props: Props) {
  const { code, copyable, inline, showLineNumbers } = props;
  const { ace } = window as any;
  const { Tokenizer } = ace.require('ace/tokenizer');
  const { SqlHighlightRules } = ace.require(`ace/mode/sql_highlight_rules`);
  const rules = new SqlHighlightRules();
  const tokenizer = new Tokenizer(rules.getRules());

  useEffect(() => {
    const { cssText } = ace.require('ace/theme/tomorrow');
    addThemeStyleManually(cssText);
  }, []);

  const lines = code.split('\n').map((line, index) => {
    const tokens = tokenizer.getLineTokens(line).tokens;
    const children = tokens.map((token, index) => {
      const classNames = token.type.split('.').map((name) => `ace_${name}`);
      return (
        <span key={index} className={classNames.join(' ')}>
          {token.value}
        </span>
      );
    });

    return (
      <span className="ace_line" key={`${line}-${index}`}>
        {showLineNumbers && <span className="line-number">{index + 1}</span>}
        {children}
      </span>
    );
  });

  return (
    <Block className="ace_editor ace-tomorrow" inline={inline}>
      {lines}
      {copyable && <CopyText copyable>{code}</CopyText>}
    </Block>
  );
}
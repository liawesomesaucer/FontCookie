/* global chrome */

import React, { useEffect, useState } from 'react';
import { useCustomizedHosts } from './hooks/useCustomizedHosts';
import {
  CrossButton,
  PlusButton,
  LetterIcon,
  LeftIcon,
  RightIcon,
} from './components/Icons';

// Next: support default lists, support adding dynamic site customizeer. Eventually
// Also support sorting
const PAGE_SIZE = 5;

export function FontCookie() {
  const [page, setPage] = useState(0);
  const { customizedHosts, customizeHost, uncustomizeHost } = useCustomizedHosts();

  const numPages = Math.ceil(Object.entries(customizedHosts).length / 5);

  return (
    <div>
      {customizedHosts ? (
        <div>
          <ul className="fontcookie__customized-site-list">
            {Object.entries(customizedHosts)
              .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
              .map(
                ([host, val]) =>
                  val && (
                    <ListItemcustomizedSite
                      host={host}
                      uncustomize={() => uncustomizeHost(host)}
                    />
                  )
              )}
          </ul>
          {numPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                className={`fontcookie__icon-button ${
                  page === 0 && 'fontcookie__icon-button-disabled'
                }`}
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                style={{ margin: 2 }}
              >
                <LeftIcon />
              </button>
              {Array.from(Array(numPages)).map((_, i) => {
                return (
                  <button
                    className={`fontcookie__icon-button ${
                      page === i && 'fontcookie__icon-button-active'
                    }`}
                    onClick={() => setPage(i)}
                    style={{ margin: 2 }}
                  >
                    {i}
                  </button>
                );
              })}
              <button
                className={`fontcookie__icon-button ${
                  page >= numPages - 1 && 'fontcookie__icon-button-disabled'
                }`}
                onClick={() => setPage(page + 1)}
                disabled={page >= numPages - 1}
                style={{ margin: 2 }}
              >
                <RightIcon />
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No hosts customized</p>
      )}

      <br />

      <CustomizeSiteInput customizeHost={customizeHost} />
    </div>
  );
}

function CustomizeSiteInput({ customizeHost }) {
  const [val, setVal] = useState('');

  useEffect(() => {
    chrome.windows.getCurrent(null, (win) => {
      // TODO: this doesn't really do what is expected
    });
  }, []);

  return (
    <div>
      <label htmlFor="fontcookie__site-input">Add site</label>
      <div className="fontcookie__form-input">
        <input
          name="fontcookie__site-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <PlusButton
          type="submit"
          onClick={() => {
            customizeHost(val);
            setVal('');
          }}
        />
      </div>
    </div>
  );
}

function ListItemcustomizedSite({ host, uncustomize }) {
  const [hasImgLoadError, setHasImgLoadErr] = useState(false);
  return (
    <li className="fontcookie__customized-site-list-item">
      <span>
        {hasImgLoadError ? (
          <LetterIcon letter={getDomainFirstLetter(host)} />
        ) : (
          <img
            className="fontcookie__customized-site-icon"
            src={`https://icons.duckduckgo.com/ip2/${host}.ico`}
            onError={({ target }) => {
              // Fallback to displaying an icon made from first letter of domain
              target.onError = null;
              setHasImgLoadErr(true);
            }}
            alt={`${host} icon`}
          />
        )}
        <span>{host}</span>
      </span>
      <CrossButton onClick={uncustomize} />
    </li>
  );
}

function getDomain(host) {
  const tmp = host?.split('.');

  if (tmp) {
    return tmp[tmp.length - 2];
  } else {
    return '?';
  }
}

function getDomainFirstLetter(host) {
  return getDomain(host)[0];
}

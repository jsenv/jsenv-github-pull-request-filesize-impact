import { assert } from "@jsenv/assert"
import { generatePullRequestCommentString } from "../../src/internal/generatePullRequestCommentString.js"

// nothing changed
{
  const actual = generatePullRequestCommentString({
    pullRequestBase: "base",
    pullRequestHead: "head",
    snapshotComparison: {
      dist: {},
    },
    generatedByLink: false,
  })
  const expected = `<details>
  <summary>Overall size impact on <code>dist</code>: 0.</summary>
  <br />
  <blockquote>changes don't affect the overall size or cache.</blockquote>
</details>`
  assert({ actual, expected })
}

// updates cancels each other impacts
{
  const actual = generatePullRequestCommentString({
    pullRequestBase: "base",
    pullRequestHead: "head",
    snapshotComparison: {
      dist: {
        "file-a.js": {
          base: {
            size: 10,
            hash: "hash1",
          },
          head: {
            size: 15,
            hash: "hash2",
          },
        },
        "file-b.js": {
          base: {
            size: 15,
            hash: "hash3",
          },
          head: {
            size: 10,
            hash: "hash4",
          },
        },
      },
    },
    generatedByLink: false,
  })
  const expected = `<details>
  <summary>Overall size impact on <code>dist</code>: 0.</summary>
  <br />
  <table>
    <thead>
      <tr>
        <th nowrap>file</th>
        <th nowrap>event</th>
        <th nowrap>diff</th>
        <th nowrap><code>base</code></th>
        <th nowrap><code>head</code></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td nowrap>file-a.js</td>
        <td nowrap>changed</td>
        <td nowrap>+5</td>
        <td nowrap>10</td>
        <td nowrap>15</td>
      </tr>
      <tr>
        <td nowrap>file-b.js</td>
        <td nowrap>changed</td>
        <td nowrap>-5</td>
        <td nowrap>15</td>
        <td nowrap>10</td>
      </tr>
    </tbody>
  </table>

  <blockquote>
    <strong>Overall size impact:</strong> 0.<br />
    <strong>Cache impact:</strong> 2 files content changed, invalidating a total of 25 bytes.
  </blockquote>
</details>`
  assert({ actual, expected })
}

// added, removed, updated
{
  const actual = generatePullRequestCommentString({
    pullRequestBase: "base",
    pullRequestHead: "head",
    snapshotComparison: {
      dist: {
        "file-added.js": {
          base: null,
          head: {
            size: 10,
            hash: "hash1",
          },
        },
        "file-removed.js": {
          base: {
            size: 20,
            hash: "hash2",
          },
          head: null,
        },
        "file-updated.js": {
          base: {
            size: 10,
            hash: "hash3",
          },
          head: {
            size: 15,
            hash: "hash4",
          },
        },
      },
    },
    generatedByLink: false,
  })
  const expected = `<details>
  <summary>Overall size impact on <code>dist</code>: -5 bytes.</summary>
  <br />
  <table>
    <thead>
      <tr>
        <th nowrap>file</th>
        <th nowrap>event</th>
        <th nowrap>diff</th>
        <th nowrap><code>base</code></th>
        <th nowrap><code>head</code></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td nowrap>file-added.js</td>
        <td nowrap>file created</td>
        <td nowrap>+10</td>
        <td nowrap>---</td>
        <td nowrap>10</td>
      </tr>
      <tr>
        <td nowrap>file-removed.js</td>
        <td nowrap>file deleted</td>
        <td nowrap>-20</td>
        <td nowrap>20</td>
        <td nowrap>---</td>
      </tr>
      <tr>
        <td nowrap>file-updated.js</td>
        <td nowrap>changed</td>
        <td nowrap>+5</td>
        <td nowrap>10</td>
        <td nowrap>15</td>
      </tr>
    </tbody>
  </table>

  <blockquote>
    <strong>Overall size impact:</strong> -5 bytes.<br />
    <strong>Cache impact:</strong> 1 files content changed, invalidating a total of 10 bytes.
  </blockquote>
</details>`
  assert({ actual, expected })
}

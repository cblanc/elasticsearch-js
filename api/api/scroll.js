/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict'

/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

function buildScroll (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts
  /**
   * Perform a [scroll](http://www.elastic.co/guide/en/elasticsearch/reference/master/search-request-body.html#search-request-scroll) request
   *
   * @param {string} scroll_id - The scroll ID
   * @param {time} scroll - Specify how long a consistent view of the index should be maintained for scrolled search
   * @param {string} scroll_id - The scroll ID for scrolled search
   * @param {boolean} rest_total_hits_as_int - Indicates whether hits.total should be rendered as an integer or an object in the rest search response
   * @param {object} body - The scroll ID if not passed by URL or query parameter.
   */

  const acceptedQuerystring = [
    'scroll',
    'scroll_id',
    'rest_total_hits_as_int',
    'pretty',
    'human',
    'error_trace',
    'source',
    'filter_path'
  ]

  const snakeCase = {
    scrollId: 'scroll_id',
    restTotalHitsAsInt: 'rest_total_hits_as_int',
    errorTrace: 'error_trace',
    filterPath: 'filter_path'
  }

  return function scroll (params, options, callback) {
    options = options || {}
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (typeof params === 'function' || params == null) {
      callback = params
      params = {}
      options = {}
    }

    // validate headers object
    if (options.headers != null && typeof options.headers !== 'object') {
      const err = new ConfigurationError(`Headers should be an object, instead got: ${typeof options.headers}`)
      return handleError(err, callback)
    }

    var warnings = []
    var { method, body, scrollId, scroll_id, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    if (method == null) {
      method = body == null ? 'GET' : 'POST'
    }

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    if ((scroll_id || scrollId) != null) {
      path = '/' + '_search' + '/' + 'scroll' + '/' + encodeURIComponent(scroll_id || scrollId)
    } else {
      path = '/' + '_search' + '/' + 'scroll'
    }

    // build request object
    const request = {
      method,
      path,
      body: body || '',
      querystring
    }

    options.warnings = warnings.length === 0 ? null : warnings
    return makeRequest(request, options, callback)
  }
}

module.exports = buildScroll

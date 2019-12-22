/* global window */
import cloneDeep from 'lodash.clonedeep'
import classnames from 'classnames'
import config from './config'
import request from './request'
import { color } from './theme'
import storage from './storage'
import pathToRegexp from 'path-to-regexp'
import { getUserByName } from './service'
import Yaml from 'yaml'

/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(regexp, pathname) {
  return pathToRegexp(regexp).exec(pathname)
}

// 连字符转驼峰
String.prototype.hyphenToHump = function() {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function() {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function(format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      )
    }
  }
  return format
}

/**
 * @param  name {String}
 * @return  {String}
 */
export function queryURL(name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * @description 数组内查询
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array, key, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(
  array,
  id = 'id',
  pid = 'pid',
  children = 'children'
) {
  let data = cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    // const node = data[index]
    // node.title = node[title]
    // node.key = node[id]
    hash[data[index][id]] = data[index]
  })

  data.forEach(item => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })

  return result
}

export const stringifyYaml = value => {
  if (!value || typeof value !== 'object') {
    return ''
  }

  try {
    return Yaml.stringify(value)
  } catch (err) {
    return ''
  }
}

export const parseYaml = value => {
  if (!value || typeof value !== 'string') {
    return {}
  }

  try {
    return Yaml.parse(value)
  } catch (err) {
    return {}
  }
}

export { classnames, cloneDeep, config, request, color, storage, getUserByName }

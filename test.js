const expect = require('chai').expect
const lib = require('./lib')

describe('Unit tests', function() {
  it('Regex having nested capture groups', function() {
    const regex = /(http:\/\/([A-Za-z0-9]*):([0-9]*))\/.*/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = { host, port }
    expect(() => lib(url, regex, replacements)).to.throw('the regex must not have nested capture groups');
  })
  it('All the capture groups must be of the same kind', function() {
    const regex = /http:\/\/(?<port>[A-Za-z0-9]*):([0-9]*)\/.*/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = { host, port }
    expect(() => lib(url, regex, replacements)).to.throw('the regex must contain only capture groups of the same kind (either named or unnamed)');
  })
  it('Replace indexed groups', function() {
    const regex = /http:\/\/([A-Za-z0-9]*):([0-9]*)\/.*/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = [host, port]
    const result = lib(url, regex, replacements)
    expect(result).to.equal('http://127.0.0.1:9090/foo/bar')    
  })
  it('Replace multiple occurences of indexed groups', function() {
    const regex = /http:\/\/([A-Za-z0-9]*):([0-9]*)/g
    const url = 'http://localhost:8080/foo/bar > http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = [host, port]
    const result = lib(url, regex, replacements)
    expect(result).to.equal('http://127.0.0.1:9090/foo/bar > http://127.0.0.1:9090/foo/bar')    
  })
  it('Replace indexed groups replacement size error', function() {
    const regex = /http:\/\/(?<host>[A-Za-z0-9]*):(?<port>[0-9]*)\/(?<path>.*)/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = [host, port]
    expect(() => lib(url, regex, replacements)).to.throw('replacements size and capture groups count must be the same in input regex');
  })
  it('Replace named groups', function() {
    const regex = /http:\/\/(?<host>[A-Za-z0-9]*):(?<port>[0-9]*)\/.*/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = { host, port }
    const result = lib(url, regex, replacements)
    expect(result).to.equal('http://127.0.0.1:9090/foo/bar')
  })
  it('Replace multiple occurences of named groups', function() {
    const regex = /http:\/\/(?<host>[A-Za-z0-9]*):(?<port>[0-9]*)/g
    const url = 'http://localhost:8080/foo/bar > http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = { host, port }
    const result = lib(url, regex, replacements)
    expect(result).to.equal('http://127.0.0.1:9090/foo/bar > http://127.0.0.1:9090/foo/bar')
  })
  it('Replace named groups replacement keys count size error', function() {
    const regex = /http:\/\/(?<host>[A-Za-z0-9]*):(?<port>[0-9]*)\/(?<path>.*)/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = { host, port }
    expect(() => lib(url, regex, replacements)).to.throw('replacements param must be a map having keys matching exactly the names of the input regex capture groups');
  })
  it('Replace named groups wrong replacement keys error', function() {
    const regex = /http:\/\/(?<host>[A-Za-z0-9]*):(?<number>[0-9]*)\.*/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = { host, port }
    expect(() => lib(url, regex, replacements)).to.throw('replacements param must be a map having keys matching exactly the names of the input regex capture groups');
  })
  it('Wrong replacement type for named capture groups', function() {
    const regex = /http:\/\/(?<host>[A-Za-z0-9]*):(?<number>[0-9]*)\.*/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = [ host, port ]
    expect(() => lib(url, regex, replacements)).to.throw('replacements param must be a map having keys matching exactly the names of the input regex capture groups');
  })
  it('Wrong replacement type for unnamed capture groups', function() {
    const regex = /http:\/\/([A-Za-z0-9]*):([0-9]*)\.*/g
    const url = 'http://localhost:8080/foo/bar'
    const host = '127.0.0.1'
    const port = 9090
    const replacements = { host, port }
    expect(() => lib(url, regex, replacements)).to.throw('replacements param must be an array of replacement values of the same size than the group count in the input regex');
  })
})
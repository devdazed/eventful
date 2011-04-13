/**
 * Module dependencies.
 */
var util = require('utility'),
    test = module.exports,
    should = require('should');

/*
 * Tests that options gets extended by defautls
 */
test['.extend'] = function(){
  var defaults = { '1':false, '2':true },
      options = { '1':true, '3':true  };
  
  var extended = util.extend(options, defaults);
  extended.should.be.a('object');
  extended.should.have.property('1', true);
  extended.should.have.property('2', true);
  extended.should.have.property('3', true);
};

/*
 * Tests proper padding of numbers with zeroes
 */
test['.zeroize'] = function(){
  util.zeroize(1).should.equal('01');
  util.zeroize(10).should.not.equal('010');
};

/*
 * Tests proper ANSI/vt100 stylization of text
 */
test['.stylize'] = function(){
  util.stylize('text').should.equal('text');
  util.stylize('[bold]text[/bold]').should.equal('\u001b[1mtext\u001b[0m');
  util.stylize('[under]text[/under]').should.equal('\u001b[4mtext\u001b[0m');
  util.stylize('[blink]text[/blink]').should.equal('\u001b[5mtext\u001b[0m');
  util.stylize('[red]text[/red]').should.equal('\u001b[31mtext\u001b[0m');
  util.stylize('[green]text[/green]').should.equal('\u001b[32mtext\u001b[0m');
  util.stylize('[purple]text[/purple]').should.equal('\u001b[35mtext\u001b[0m');
  util.stylize('[yellow]text[/yellow]').should.equal('\u001b[33mtext\u001b[0m');
  util.stylize('[blue]text[/blue]').should.equal('\u001b[34mtext\u001b[0m');
  util.stylize('[cyan]text[/cyan]').should.equal('\u001b[36mtext\u001b[0m');
  util.stylize('[white]text[/white]').should.equal('\u001b[37mtext\u001b[0m');
  //test nesting now
  util.stylize('[bold][red][under]text[/under][/red][/bold]').should.equal('\u001b[1m\u001b[31m\u001b[4mtext\u001b[0m\u001b[0m\u001b[0m');
};
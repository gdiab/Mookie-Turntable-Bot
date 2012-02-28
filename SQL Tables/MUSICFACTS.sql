-- phpMyAdmin SQL Dump
-- version 3.3.2deb1ubuntu1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 11, 2012 at 10:38 PM
-- Server version: 5.1.41
-- PHP Version: 5.3.2-1ubuntu4.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nodejs_mysql_mookie`
--

-- --------------------------------------------------------

--
-- Table structure for table `MUSICFACTS`
--

CREATE TABLE IF NOT EXISTS `MUSICFACTS` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fact` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=59 ;

--
-- Dumping data for table `CATFACTS`
--

INSERT INTO `MUSICFACTS` (`id`, `fact`) VALUES
(1, 'Run-DMC had the first Rap album certified Gold.'),
(2, 'Cobain didn''t know it when he wrote the song, but Teen Spirit is a brand of deodorant marketed to young girls. Kurt thought Hanna was complimenting him on his rebellious spirit, as someone who could inspire youth. Sales of Teen Spirit deodorant shot up when this became a hit, even though it is never mentioned in the lyrics.'),
(4, 'Will Smith was the first rapper to be nominated for an Academy Award.'),
(5, 'The eagle spread its mighty wings And pounced upon its prey; And all the skies, so brilliant blue Turned suddenly to grey. Rainy Day In June - The Kinks'),
(6, 'Born In The U.S.A. was the first CD manufactured in the United States for commercial release. It was pressed when CBS Records opened its CD manufacturing plant in Terre Haute, Indiana in 1984. Discs previously had been imported from Japan.'),
(7, 'Red Hot Chili Peppers'' Kiedis was born to actor Blackie Dammett and had some early acting roles in F.I.S.T. (1978) and Jokes My Folks Never Told Me (1978). You may not have recognized him because he was billed as Cole Dammett. His mother is part Apache Indian.'),
(8, 'With Underoath, Aaron Gillespie wrote songs like "It''s Dangerous Business Walking Out Your Front Door," which is about a guy so in love with a girl he decides to kill her.'),
(9, 'Beautiful Loser by Bob Seger is about people who never try to achieve greatness.'),
(10, 'Darren King of MUTEMATH thought he would someday have Jesus-like powers. He was also worried about his mom getting raptured.'),
(11, '"Mr. Jones" is Marty Jones, a friend of Adam Duritz. They were in a band together called The Himalayans. It''s a good thing Adam wasn''t hanging around with Sid Lipshitz. '),
(12, 'In 1957 Billy Vaughn pulled off a feat that no other instrumentalist has ever matched; he had a two-sided Top Ten hit record. "Sail Along Silvery Moon" peaked at #5 while the flip-side, "Raunchy", reached #10!'),
(13, 'Bo Diddley was introduced to the MTV generation when he played pool against George Thorogood in Thorogood''s video for "Bad to the Bone."'),
(14, 'The Killer''s name came from the fictional band in New Order''s music video for their song Crystal.'),
(15, 'Before joining The Killers, Brandon Flowers, vocalist/keyboardist of The Killers, was in a synth-pop called Blush Response.'),
(16, 'Killers lead singer Brandon Flowers is a Mormon, but he said in 2004 that he does occasionally drink and smoke. The band keeps their rock star decadence low key, with the drugs and groupies kept to a minimum.'),
(17, 'De la Rocha has traveled to Chiapas, Mexico to work with rebel group the Zapatistas. Here he picked up smoking cigarettes as a way to initiate conversation.'),
(18, 'All the members of Radiohead were students at Abingdon School (near Oxford). They all still live nearby.'),
(19, 'Their original name was On A Friday. They switched to Radiohead in 1989 because it was the name of a Talking Heads song.'),
(20, 'De la Rocha is a Mexican-American; Morello is an African-American. Both their sets of parents are divorced and both faced lots of prejudice as children. Morello calls de la Rocha his "ideological brother.".'),
(37, 'In-A-Gadda-Da-Vida by Iron Butterfly Was supposed to be called "In The Garden Of Eden." Someone got drunk and wrote "In-A-Gadda-Da-Vida" on the reel. They kept the name because it sounded mystical.'),
(36, 'Bridge Over Troubled Water by Simon and Garfunkel. Paul Simon wrote it, Art Garfunkel sang it.'),
(35, 'The 2 Live Crew sampled Ain''t Talkin'' ''Bout Love by Van Halen on their 1989 song "The Funk Shop." The dirty version wasn''t called "Funk" Shop. Van Halen ended up with a nice settlement after suing the rappers. '),
(34, 'Eric Clapton played lead guitar on While My Guitar Gently Weeps. He and George Harrison were good friends, but George had to convince him to come to the studio because Clapton was worried the other Beatles wouldn''t want him there. Clapton''s presence eased the mood in the studio at a tense time for The Beatles. They were at each other''s throats during recording of The White Album, but they all relaxed when Clapton showed up.'),
(33, 'The members of Neon Trees are all big fans of Lady Gaga. Of the controversial star, Tyler Green said, "I think the band collectively enjoys her, but I myself am actually really inspired and moved by her as an artist. She is smarter than anyone really thinks, and she depends on her fans and bleeds for them. There isn''t enough of that genuine spirit in music."'),
(32, 'Noah and the Whale''s sophomore effort, The First Days of Spring, revolves around lead singer Charlie Fink''s break-up with prominent British indie-folk artist Laura Marling.'),
(31, 'In 1995, Pearl Jam recorded an album with Neil Young called Mirror Ball. Because of record company restrictions, the name Pearl Jam could not appear anywhere on the album, but each member is named individually.'),
(38, 'Abraham Lincoln loved cats. He had four of them while he lived in the White House.'),
(39, '"New Wave is basically all I listen to," says singer and guitarist Tyler Glenn of Neon Trees.'),
(40, 'In 2005, NIN released their long overdue fourth full-length album, With Teeth, written in the shadow of Reznor''s battle with alcoholism and substance abuse. Singles include "The Hand That Feeds" and "Every Day is Exactly The Same" but the album was generally slammed by critics as being unoriginal and lacking in signature Reznor creativity.'),
(41, '"Robot parade, robot parade / Wave the flags that the robots made" - Robot Parade - They Might Be Giants'),
(42, 'Andre wrote the first version of "Hey Ya" around 1999, and it almost made it onto their 2000 album Stankonia. At the time the song was called "Thank God For Mom And Dad." He started working on it again in 2002, doing lots of experimentation along the way. A lot of lyrics he wrote for the song didn''t make the cut.'),
(43, 'Morello spent two years as a scheduling secretary for California Senator Alan Cranston (Democrat).'),
(44, 'After a number of delays, Drake''s first full length album Thank Me Later came out in May 2010. The record featured collaborations with prominent Hip-Hop stars like Jay-Z, Kanye West, and Lil'' Wayne. The album sold over 400,000 copies in its first week, giving Drake his first #1 album.'),
(45, 'Over the course of his career, DMX has been incarcerated several times on charges that include animal cruelty, reckless driving, drug possession, and identity falsification.'),
(46, '"Growing older is not upsetting; being perceived as old is" - Kenny Rogers.'),
(47, 'In October 1965, Johnny Cash was arrested upon returning from Mexico when US Customs agents searched his luggage and found hundreds of illegal pills. He was sentenced to 30 days in jail and fined $1,000.'),
(48, 'On Rage Against The Machine''s first album, the cover is a Pulitzer prize winning photo of a burning monk. The Vietnamese Buddist monk is Thich Quang Duc, who burned himself to death. This act of self-immolation was protesting against the Prime Minister Ngo Dih Diem who was oppressing the Buddhist religion.'),
(49, 'A requirement at Johnny Cash shows was an American flag on stage in full view of the audience.'),
(50, 'Henry Rollins has been an MTV VJ and appeared in numerous movies, including Heat, Johnny Mnemonic, Jackass and The Chase.'),
(51, 'Penelope Cruz told Q magazine December 2009 she loves the song Everything in its Right Place by Radiohead. She said: "I like that line, ''Yesterday I woke up sucking a lemon.'' That song scared me so much, I became obsessed with it."'),
(52, 'Less Than Jake were formed in 1992, by Chris Demakes and drummer Vinnie Fiorello while the two attended the University of Florida in Gainesville. The band takes its name from Fiorello''s dog. The dog, Jake, seemed to be treated better than the humans in his household so that everything was dubbed "less than Jake" and so the band assumed this moniker. On July 13, 1992, Less Than Jake officially became a band.'),
(53, 'Having been turned on to Black Flag by a friend of his named Mitch Parker, Rollins became such a huge fan of the band that they invited him to a rehearsal. There, he asked to sing "Clocked In" and the band was so impressed with him that they asked him to be lead singer. Incidentally, Rollins'' friend Ian MacKaye of Fugazi encouraged him to take the Black Flag job.'),
(54, 'The band They Might Be Giants hates being described as "quirky"'),
(55, 'Chris Martin of Coldplay was in the 2004 movie Shaun Of The Dead. He played a zombie.'),
(56, 'It has been scientifically proven that stroking a cat can lower one''s blood pressure.'),
(57, '"Rage Against The Machine" is the title of an Inside Out song. Inside Out is a hard-core band on Revelation Records that Zack was in before they broke up and he formed RATM with Tom Morello. '),
(58, 'Like many other alternative bands, in their 2008 tour rider Rage Against The Machine required promoters to provide socks and cotton underwear before each performance.');

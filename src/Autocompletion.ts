import Executable from './providers/Executable';
import Command from './providers/Command';
import File from './providers/File';
import Alias from './providers/Alias';
import History from './providers/History';
import HistoryExpansion from "./providers/HistoryExpansion";
import * as _ from 'lodash';
import * as i from './Interfaces';
import Prompt from "./Prompt";

export default class Autocompletion implements i.AutocompletionProvider {
    static providers = [new Command(), new Alias(), new Executable(), new File(), new History(), new HistoryExpansion()];
    static limit = 9;

    getSuggestions(prompt: Prompt) {
        return Promise.all(_.map(Autocompletion.providers, provider => provider.getSuggestions(prompt))).then(results =>
            _._(results)
                .flatten()
                .select((suggestion: i.Suggestion) => suggestion.score > 0)
                .sortBy((suggestion: i.Suggestion) => -suggestion.score)
                .uniq('value')
                .take(Autocompletion.limit)
                .value()
        );
    }
}

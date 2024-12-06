from datetime import datetime
from bs4 import BeautifulSoup
import requests
import pandas as pd


class DFStorage:
    def __init__(
        self,
        columns: list | None = [
            'title',
            'html_text',
            'plain_text',
            'category',
            'author',
            'pub_date',
            'link',
        ],
        csv_filepath: str | None = None,
    ):
        self.columns = columns
        self.csv_filepath = csv_filepath
        self.create_df()

    def create_df(self):
        if self.columns:
            self.df = pd.DataFrame(columns=self.columns)
        if self.csv_filepath:
            self.df = pd.read_csv(self.csv_filepath)

    def append(self, data: dict):
        self.df = pd.concat([pd.DataFrame(data, index=[0]), self.df], ignore_index=True)

    def get_last_record(self):
        return self.df.iloc[-1].to_dict()

    def save_to_csv(self, filename: str):
        self.df.to_csv(f'./rss_feeder/{filename}.csv', index=False)
        self.create_df()

    def __len__(self):
        return len(self.df)


class NakedScienceFeeder:
    URL = 'https://naked-science.ru/?yandex_feed=news'
    FILENAME = 'naked_science'

    def __init__(
        self,
        storage: DFStorage = DFStorage(),
        last_date: str | None = None,
        last_hash: str | None = None,
    ):
        self.storage = storage
        self.last_date: datetime = (
            self._convert_str_to_datetime(last_date) if last_date else None
        )
        self.last_hash = last_hash

    def _convert_str_to_datetime(self, date_str: str):
        datetime_object = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %z")
        return datetime_object

    def parse_feed(self):
        print('Before', len(self.storage))
        feed = requests.get(self.URL).text
        soup = BeautifulSoup(feed, 'xml')
        for item in soup.find_all('item'):
            parsed_item = self.parse_item(item)
            if parsed_item is not None:
                self.storage.append(parsed_item)
        print('After', len(self.storage))
        self.storage.save_to_csv(filename=self.FILENAME)

    def parse_item(self, item: BeautifulSoup):
        category = item.find('category').text
        pub_date = item.find('pubDate').text
        pub_datetime = self._convert_str_to_datetime(pub_date)

        if (category == '-') or (
            self.last_date is not None and self.last_date >= pub_datetime
        ):
            return

        news = {
            'title': item.find('title').text,
            'html_text': item.find('turbo:content').text,
            'plain_text': item.find('yandex:full-text').text,
            'category': category,
            'author': item.find('author').text,
            'pub_date': pub_date,
            'link': item.find('link').text,
        }
        return news


if __name__ == '__main__':
    UPDATE = True
    if UPDATE:
        storage = DFStorage(csv_filepath='./rss_feeder/naked_science.csv')
        feeder = NakedScienceFeeder(
            last_date=storage.get_last_record()['pub_date'], storage=storage
        )
    else:
        feeder = NakedScienceFeeder()
    feeder.parse_feed()
